<script setup lang="ts">
import { computed, inject, onBeforeUnmount, watch } from 'vue'
import { OPTION_GROUP_KEY, SELECT_KEY } from '../tokens'
import type { OptionData, OptionProps } from '../types'
import { getPath } from '../composables/useOptions'
import OptionItem from './OptionItem.vue'

defineOptions({ name: 'VsOption' })

const props = defineProps<OptionProps>()

const select = inject(SELECT_KEY, null)
if (!select) throw new Error('[vue-select-kit] <VsOption> must be used inside <VsSelect>.')
const group = inject(OPTION_GROUP_KEY, null)

const key = computed(() => select.getKey(props.value))
const label = computed(() => {
  if (props.label != null) return String(props.label)
  const v = props.value
  return v !== null && typeof v === 'object' ? String(getPath(v, 'label') ?? key.value) : String(v)
})
const baseDisabled = computed(() => !!props.disabled || !!group?.disabled.value)

const data = computed<OptionData>(() => ({
  key: key.value,
  value: props.value,
  label: label.value,
  disabled: baseDisabled.value,
}))

const selected = computed(() => select.isSelected(key.value))
const disabled = computed(() => baseDisabled.value || (select.isLimitReached.value && !selected.value))
const visible = computed(
  () => !select.localFilter.value || select.query.value === '' || select.matches(label.value),
)

watch(
  data,
  (next, prev) => {
    if (prev && prev.key !== next.key) {
      select.unregister(prev.key)
      group?.unregister(prev.key)
    }
    select.register(next)
    group?.register(next.key, visible)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  select.unregister(key.value)
  group?.unregister(key.value)
})
</script>

<template>
  <OptionItem
    v-if="visible"
    :id="select.getOptionId(key)"
    :label="label"
    :disabled="disabled"
    :selected="selected"
    :hovered="select.hoverKey.value === key"
    @hover="select.setHover(key)"
    @select="select.select(data)"
  >
    <slot>{{ label }}</slot>
  </OptionItem>
</template>
