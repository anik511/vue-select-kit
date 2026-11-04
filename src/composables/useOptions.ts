import { computed, type Ref } from 'vue'
import type { DropdownRow, OptionData, OptionPropsMapping } from '../types'

export function getPath(obj: any, path: string): any {
  if (obj == null || typeof obj !== 'object') return undefined
  return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj)
}

const DEFAULT_MAPPING: Required<OptionPropsMapping> = {
  label: 'label',
  value: 'value',
  disabled: 'disabled',
  options: 'options',
}

/** Normalizes the data-driven `options` prop into flat dropdown rows. */
export function useDataOptions(
  source: () => Record<string, any>[] | undefined,
  mapping: () => OptionPropsMapping | undefined,
  getKey: (value: any) => any,
  query: Ref<string>,
  localFilter: () => boolean,
  matches: (label: string) => boolean,
) {
  const keys = computed(() => ({ ...DEFAULT_MAPPING, ...mapping() }))

  function toOption(raw: Record<string, any>, groupDisabled: boolean): OptionData {
    const k = keys.value
    const value = raw[k.value]
    const label = raw[k.label]
    return {
      key: getKey(value),
      value,
      label: label == null ? String(value) : String(label),
      disabled: groupDisabled || !!raw[k.disabled],
      raw,
    }
  }

  /** Every option, unfiltered — used to resolve labels of selected values. */
  const allOptions = computed<OptionData[]>(() => {
    const list: OptionData[] = []
    for (const item of source() ?? []) {
      const children = item[keys.value.options]
      if (Array.isArray(children)) {
        const disabled = !!item[keys.value.disabled]
        for (const child of children) list.push(toOption(child, disabled))
      } else {
        list.push(toOption(item, false))
      }
    }
    return list
  })

  const rows = computed<DropdownRow[]>(() => {
    const filter = localFilter() && query.value !== ''
    const result: DropdownRow[] = []
    let groupIndex = 0
    for (const item of source() ?? []) {
      const children = item[keys.value.options]
      if (Array.isArray(children)) {
        const disabled = !!item[keys.value.disabled]
        const opts = children
          .map((c) => toOption(c, disabled))
          .filter((o) => !filter || matches(o.label))
        if (opts.length) {
          result.push({ type: 'group', label: String(item[keys.value.label] ?? ''), id: `g${groupIndex}` })
          for (const option of opts) result.push({ type: 'option', option })
        }
        groupIndex++
      } else {
        const option = toOption(item, false)
        if (!filter || matches(option.label)) result.push({ type: 'option', option })
      }
    }
    return result
  })

  return { allOptions, rows }
}
