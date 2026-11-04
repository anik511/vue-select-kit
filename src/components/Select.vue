<script setup lang="ts">
import { computed, nextTick, provide, ref, shallowReactive, useSlots, watch } from 'vue'
import { SELECT_KEY } from '../tokens'
import type { DropdownRow, OptionData, SelectProps } from '../types'
import { getPath, useDataOptions } from '../composables/useOptions'
import { usePopper } from '../composables/usePopper'
import { useClickOutside } from '../composables/useClickOutside'
import { useRemote } from '../composables/useRemote'
import { useKeyboard } from '../composables/useKeyboard'
import OptionItem from './OptionItem.vue'
import Tag from './Tag.vue'
import VirtualList from './VirtualList.vue'

defineOptions({ name: 'VsSelect' })

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: 'Select',
  size: 'default',
  valueKey: 'value',
  remoteDelay: 300,
  loadingText: 'Loading',
  noMatchText: 'No matching data',
  noDataText: 'No data',
  reserveKeyword: true,
  multipleLimit: 0,
  maxCollapseTags: 1,
  teleported: true,
  placement: 'bottom',
  height: 274,
  itemHeight: 34,
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
  'visible-change': [visible: boolean]
  'remove-tag': [value: any]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

defineSlots<{
  default?(): any
  prefix?(): any
  empty?(): any
  header?(): any
  footer?(): any
  loading?(): any
  label?(props: { label: string; value: any }): any
  tag?(props: { option: OptionData; close: () => void }): any
  option?(props: { item: OptionData }): any
}>()

const slots = useSlots()

let seq = 0
const baseId = props.id ?? `vs-select-${Math.random().toString(36).slice(2, 8)}`

const wrapperRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const dropdownRef = ref<HTMLElement>()
const virtualRef = ref<{ scrollToIndex: (index: number) => void }>()

const visible = ref(false)
const query = ref('')
const hoverKey = ref<any>()
const focused = ref(false)
const hovering = ref(false)

// ---------- identity & lookup ----------
function getKey(value: any) {
  return value !== null && typeof value === 'object' ? getPath(value, props.valueKey) : value
}

const idByKey = new Map<any, string>()
const keyById = new Map<string, any>()
function getOptionId(key: any) {
  let id = idByKey.get(key)
  if (!id) {
    id = `${baseId}-option-${seq++}`
    idByKey.set(key, id)
    keyById.set(id, key)
  }
  return id
}

const isDataMode = computed(() => Array.isArray(props.options))
const localFilter = computed(() => props.filterable && !props.remote && !props.filterMethod)
function matches(label: string) {
  return label.toLowerCase().includes(query.value.trim().toLowerCase())
}

/** Options registered by <VsOption> children. */
const slotOptions = shallowReactive(new Map<any, OptionData>())
/** Options that were selected, kept so labels survive remote reloads / created values. */
const cache = shallowReactive(new Map<any, OptionData>())

const { allOptions, rows } = useDataOptions(
  () => props.options,
  () => props.props,
  getKey,
  query,
  () => localFilter.value,
  matches,
)
const dataMap = computed(() => new Map(allOptions.value.map((o) => [o.key, o])))

function lookup(key: any): OptionData | undefined {
  return slotOptions.get(key) ?? dataMap.value.get(key) ?? cache.get(key)
}

// ---------- selection ----------
const isEmpty = (v: any) => v === undefined || v === null || v === ''

const selectedValues = computed<any[]>(() => {
  if (props.multiple) return Array.isArray(props.modelValue) ? props.modelValue : []
  return isEmpty(props.modelValue) ? [] : [props.modelValue]
})
const selectedKeys = computed(() => new Set(selectedValues.value.map(getKey)))
const selectedOptions = computed<OptionData[]>(() =>
  selectedValues.value.map((value) => {
    const key = getKey(value)
    return (
      lookup(key) ?? {
        key,
        value,
        label: String((typeof value === 'object' && getPath(value, 'label')) ?? key ?? ''),
        disabled: false,
      }
    )
  }),
)
const hasValue = computed(() => selectedValues.value.length > 0)
const selectedLabel = computed<string | string[]>(() =>
  props.multiple ? selectedOptions.value.map((o) => o.label) : (selectedOptions.value[0]?.label ?? ''),
)
const isLimitReached = computed(
  () => props.multiple && props.multipleLimit > 0 && selectedValues.value.length >= props.multipleLimit,
)

function isOptionDisabled(o: OptionData) {
  return o.disabled || (isLimitReached.value && !selectedKeys.value.has(o.key))
}

function sameValue(a: any, b: any) {
  if (props.multiple) {
    const x = Array.isArray(a) ? a : []
    const y = Array.isArray(b) ? b : []
    return x.length === y.length && x.every((v, i) => getKey(v) === getKey(y[i]))
  }
  return getKey(a) === getKey(b)
}

function emitValue(value: any) {
  const changed = !sameValue(value, props.modelValue)
  emit('update:modelValue', value)
  if (changed) emit('change', value)
}

function select(option: OptionData) {
  if (isOptionDisabled(option)) return
  if (props.multiple) {
    const values = [...selectedValues.value]
    const index = values.findIndex((v) => getKey(v) === option.key)
    if (index > -1) values.splice(index, 1)
    else {
      values.push(option.value)
      cache.set(option.key, { ...option, created: false })
    }
    emitValue(values)
    hoverKey.value = option.key
    if (props.filterable) {
      if (!props.reserveKeyword || option.created) query.value = ''
      inputRef.value?.focus()
    }
  } else {
    cache.set(option.key, { ...option, created: false })
    emitValue(option.value)
    close()
  }
}

function removeTag(option: OptionData) {
  if (props.disabled || option.disabled) return
  emitValue(selectedValues.value.filter((v) => getKey(v) !== option.key))
  emit('remove-tag', option.value)
}

function removeLast() {
  for (let i = selectedOptions.value.length - 1; i >= 0; i--) {
    const option = selectedOptions.value[i]
    if (!option.disabled) return removeTag(option)
  }
}

function clear(e: Event) {
  e.stopPropagation()
  emitValue(props.multiple ? [] : undefined)
  emit('clear')
  close()
}

// ---------- created option (allow-create) ----------
const createdOption = computed<OptionData | null>(() => {
  if (!props.allowCreate || !props.filterable) return null
  const q = query.value.trim()
  if (!q) return null
  const known = (o: OptionData) => o.label === q
  if ([...slotOptions.values()].some(known) || allOptions.value.some(known) || selectedOptions.value.some(known))
    return null
  return { key: q, value: q, label: q, disabled: false, created: true }
})

const listRows = computed<DropdownRow[]>(() =>
  createdOption.value ? [{ type: 'option', option: createdOption.value }, ...rows.value] : rows.value,
)

// ---------- empty / loading ----------
const visibleOptionCount = computed(() => {
  if (isDataMode.value) return rows.value.filter((r) => r.type === 'option').length
  let n = 0
  for (const o of slotOptions.values()) if (!localFilter.value || !query.value || matches(o.label)) n++
  return n
})

const emptyText = computed(() => {
  if (props.loading) return props.loadingText
  if (createdOption.value || visibleOptionCount.value > 0) return ''
  return props.filterable && query.value ? props.noMatchText : props.noDataText
})

// ---------- open / close ----------
function open() {
  if (props.disabled || visible.value) return
  visible.value = true
  hoverKey.value = props.multiple ? undefined : selectedOptions.value[0]?.key
  if (hoverKey.value !== undefined) scrollToKey(hoverKey.value)
}

function close() {
  if (!visible.value) return
  visible.value = false
  query.value = ''
  hoverKey.value = undefined
}

function toggleMenu() {
  if (visible.value) close()
  else open()
}

watch(visible, (v) => emit('visible-change', v))

function onWrapperClick(e: MouseEvent) {
  if (props.disabled) return
  inputRef.value?.focus()
  if (visible.value && props.filterable && e.target === inputRef.value) return
  toggleMenu()
}

function onWrapperMousedown(e: MouseEvent) {
  // keep focus on the input when clicking anywhere else in the trigger
  if (e.target !== inputRef.value) e.preventDefault()
}

useClickOutside([wrapperRef, dropdownRef], () => {
  close()
})

// ---------- query / filtering ----------
const remote = useRemote(
  () => props.remoteMethod,
  () => props.remoteDelay,
)

watch(query, (q) => {
  if (!props.filterable) return
  if (props.remote) {
    if (visible.value) remote.search(q)
  } else if (props.filterMethod) {
    props.filterMethod(q)
  }
  if (props.defaultFirstOption && q) {
    nextTick(() => (hoverKey.value = navigableKeys()[0]))
  } else if (hoverKey.value !== undefined && !navigableKeysNow().includes(hoverKey.value)) {
    hoverKey.value = undefined
  }
})

function onInput(e: Event) {
  if (!props.filterable) return
  query.value = (e.target as HTMLInputElement).value
  if (!visible.value) open()
}

// ---------- keyboard ----------
function navigableKeysNow(): any[] {
  if (isDataMode.value) {
    return listRows.value
      .filter((r): r is Extract<DropdownRow, { type: 'option' }> => r.type === 'option')
      .filter((r) => !isOptionDisabled(r.option))
      .map((r) => r.option.key)
  }
  // slot mode: filtered-out <VsOption>s render nothing, so DOM order is display order
  const keys: any[] = []
  dropdownRef.value
    ?.querySelectorAll<HTMLElement>('.vs-select__options .vs-option:not(.is-disabled)')
    .forEach((el) => keyById.has(el.id) && keys.push(keyById.get(el.id)))
  return keys
}
const navigableKeys = navigableKeysNow

function scrollToKey(key: any) {
  nextTick(() => {
    if (props.virtual && isDataMode.value) {
      const index = listRows.value.findIndex((r) => r.type === 'option' && r.option.key === key)
      virtualRef.value?.scrollToIndex(index)
    } else {
      const el = dropdownRef.value?.querySelector<HTMLElement>(`[id="${getOptionId(key)}"]`)
      el?.scrollIntoView?.({ block: 'nearest' })
    }
  })
}

function selectHovered() {
  const key = hoverKey.value
  if (createdOption.value && createdOption.value.key === key) return select(createdOption.value)
  const option = isDataMode.value ? dataMap.value.get(key) : slotOptions.get(key)
  if (option) select(option)
}

const { onKeydown } = useKeyboard({
  visible,
  hoverKey,
  navigableKeys,
  open,
  close,
  selectHovered,
  removeLast,
  canRemoveLast: () => props.multiple && query.value === '' && hasValue.value,
  scrollToKey,
})

function onFocus(e: FocusEvent) {
  focused.value = true
  emit('focus', e)
}
function onBlur(e: FocusEvent) {
  focused.value = false
  emit('blur', e)
}

// ---------- display ----------
const showLabelSlot = computed(
  () => !!slots.label && !props.multiple && hasValue.value && !(props.filterable && visible.value),
)

const inputValue = computed(() => {
  if (props.multiple || (props.filterable && visible.value)) return query.value
  return showLabelSlot.value ? '' : (selectedLabel.value as string)
})

const inputPlaceholder = computed(() => {
  if (props.multiple) return hasValue.value ? '' : props.placeholder
  if (!hasValue.value) return props.placeholder
  return props.filterable && visible.value ? (selectedLabel.value as string) : ''
})

const showClear = computed(
  () => props.clearable && !props.disabled && hasValue.value && (hovering.value || focused.value),
)

const shownTags = computed(() =>
  props.collapseTags ? selectedOptions.value.slice(0, props.maxCollapseTags) : selectedOptions.value,
)
const collapsedTags = computed(() =>
  props.collapseTags ? selectedOptions.value.slice(props.maxCollapseTags) : [],
)
const tooltipOpen = ref(false)

// ---------- dropdown positioning ----------
const { style: popperStyle, actualPlacement, update: updatePopper } = usePopper(wrapperRef, dropdownRef, visible, {
  teleported: () => props.teleported,
  placement: () => props.placement,
})
watch([() => selectedValues.value.length, visibleOptionCount, () => props.loading], () => {
  if (visible.value) nextTick(updatePopper)
})

const activeDescendant = computed(() =>
  visible.value && hoverKey.value !== undefined ? getOptionId(hoverKey.value) : undefined,
)

provide(SELECT_KEY, {
  query,
  hoverKey,
  localFilter,
  isSelected: (key) => selectedKeys.value.has(key),
  isLimitReached,
  getKey,
  getOptionId,
  matches,
  register: (option) => slotOptions.set(option.key, option),
  unregister: (key) => slotOptions.delete(key),
  select,
  setHover: (key) => (hoverKey.value = key),
})

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  toggleMenu,
  selectedLabel,
})
</script>

<template>
  <div
    ref="wrapperRef"
    class="vs-select"
    :class="[
      `vs-select--${size}`,
      {
        'is-disabled': disabled,
        'is-focused': focused || visible,
        'is-open': visible,
        'is-multiple': multiple,
        'is-filterable': filterable,
      },
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @mousedown="onWrapperMousedown"
    @click="onWrapperClick"
  >
    <span v-if="$slots.prefix" class="vs-select__prefix"><slot name="prefix" /></span>

    <div class="vs-select__selection">
      <template v-if="multiple">
        <template v-for="option in shownTags" :key="option.key">
          <slot name="tag" :option="option" :close="() => removeTag(option)">
            <Tag :closable="!disabled && !option.disabled" @close="removeTag(option)">{{ option.label }}</Tag>
          </slot>
        </template>
        <span
          v-if="collapsedTags.length"
          class="vs-select__collapsed"
          @mouseenter="tooltipOpen = collapseTagsTooltip"
          @mouseleave="tooltipOpen = false"
        >
          <Tag info>+ {{ collapsedTags.length }}</Tag>
          <div v-if="tooltipOpen" class="vs-select__tooltip" @click.stop>
            <Tag
              v-for="option in collapsedTags"
              :key="option.key"
              :closable="!disabled && !option.disabled"
              @close="removeTag(option)"
            >
              {{ option.label }}
            </Tag>
          </div>
        </span>
      </template>

      <span v-if="showLabelSlot" class="vs-select__label">
        <slot name="label" :label="(selectedLabel as string)" :value="modelValue" />
      </span>

      <input
        :id="id"
        ref="inputRef"
        class="vs-select__input"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-haspopup="listbox"
        :aria-expanded="visible"
        :aria-controls="`${baseId}-listbox`"
        :aria-activedescendant="activeDescendant"
        :name="name"
        :value="inputValue"
        :placeholder="inputPlaceholder"
        :readonly="!filterable"
        :disabled="disabled"
        @input="onInput"
        @keydown="onKeydown"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>

    <span class="vs-select__suffix">
      <button
        v-if="showClear"
        type="button"
        class="vs-select__clear"
        tabindex="-1"
        aria-label="Clear"
        @click="clear"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="7" fill="currentColor" />
          <path d="M5.5 5.5l5 5m0-5l-5 5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
      <svg v-else class="vs-select__arrow" :class="{ 'is-reverse': visible }" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>

    <Teleport to="body" :disabled="!teleported">
      <Transition name="vs-zoom">
        <div
          v-show="visible"
          ref="dropdownRef"
          class="vs-select-dropdown"
          :class="[popperClass, `is-${actualPlacement}`, { 'is-multiple': multiple }]"
          :style="popperStyle"
          @mousedown.prevent
          @click.stop
        >
          <div v-if="$slots.header" class="vs-select-dropdown__header"><slot name="header" /></div>

          <div v-if="loading" class="vs-select-dropdown__empty">
            <slot name="loading">{{ loadingText }}</slot>
          </div>

          <!-- data-driven, virtualized -->
          <VirtualList
            v-if="isDataMode && virtual && !loading && listRows.length"
            :id="`${baseId}-listbox`"
            ref="virtualRef"
            class="vs-select__options"
            role="listbox"
            :aria-multiselectable="multiple"
            :items="listRows"
            :item-height="itemHeight"
            :height="height"
            :item-key="(row) => (row.type === 'group' ? `g:${row.id}` : `o:${getOptionId(row.option.key)}`)"
          >
            <template #default="{ item: row }">
              <li v-if="row.type === 'group'" class="vs-option-group__title" :style="{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px` }">
                {{ row.label }}
              </li>
              <OptionItem
                v-else
                :id="getOptionId(row.option.key)"
                :label="row.option.created ? `Create “${row.option.label}”` : row.option.label"
                :disabled="isOptionDisabled(row.option)"
                :selected="selectedKeys.has(row.option.key)"
                :hovered="hoverKey === row.option.key"
                :created="row.option.created"
                :multiple="multiple"
                :height="itemHeight"
                @hover="hoverKey = row.option.key"
                @select="select(row.option)"
              >
                <slot v-if="!row.option.created" name="option" :item="row.option">{{ row.option.label }}</slot>
              </OptionItem>
            </template>
          </VirtualList>

          <!-- data-driven or slot options; kept mounted (v-show) so slot options stay registered -->
          <ul
            v-if="!(isDataMode && virtual)"
            v-show="!loading && (isDataMode ? listRows.length > 0 : !!createdOption || visibleOptionCount > 0)"
            :id="`${baseId}-listbox`"
            class="vs-select__options vs-select-dropdown__list"
            role="listbox"
            :aria-multiselectable="multiple"
            :style="{ maxHeight: `${height}px` }"
          >
            <OptionItem
              v-if="!isDataMode && createdOption"
              :id="getOptionId(createdOption.key)"
              :label="`Create “${createdOption.label}”`"
              :hovered="hoverKey === createdOption.key"
              :disabled="isLimitReached"
              created
              @hover="hoverKey = createdOption.key"
              @select="select(createdOption)"
            />
            <template v-if="isDataMode">
              <template v-for="row in listRows" :key="row.type === 'group' ? `g:${row.id}` : `o:${getOptionId(row.option.key)}`">
                <li v-if="row.type === 'group'" class="vs-option-group__title" role="presentation">{{ row.label }}</li>
                <OptionItem
                  v-else
                  :id="getOptionId(row.option.key)"
                  :label="row.option.created ? `Create “${row.option.label}”` : row.option.label"
                  :disabled="isOptionDisabled(row.option)"
                  :selected="selectedKeys.has(row.option.key)"
                  :hovered="hoverKey === row.option.key"
                  :created="row.option.created"
                  :multiple="multiple"
                  @hover="hoverKey = row.option.key"
                  @select="select(row.option)"
                >
                  <slot v-if="!row.option.created" name="option" :item="row.option">{{ row.option.label }}</slot>
                </OptionItem>
              </template>
            </template>
            <slot v-else />
          </ul>

          <div v-if="!loading && emptyText" class="vs-select-dropdown__empty">
            <slot name="empty">{{ emptyText }}</slot>
          </div>

          <div v-if="$slots.footer" class="vs-select-dropdown__footer"><slot name="footer" /></div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
