import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { OptionData } from './types'

export interface SelectContext {
  query: Ref<string>
  hoverKey: Ref<any>
  /** True when options should be filtered locally by the query. */
  localFilter: ComputedRef<boolean>
  isSelected: (key: any) => boolean
  isLimitReached: ComputedRef<boolean>
  getKey: (value: any) => any
  getOptionId: (key: any) => string
  matches: (label: string) => boolean
  register: (option: OptionData) => void
  unregister: (key: any) => void
  select: (option: OptionData) => void
  setHover: (key: any) => void
}

export interface OptionGroupContext {
  disabled: ComputedRef<boolean>
  register: (key: any, visible: ComputedRef<boolean>) => void
  unregister: (key: any) => void
}

export const SELECT_KEY: InjectionKey<SelectContext> = Symbol('VsSelect')
export const OPTION_GROUP_KEY: InjectionKey<OptionGroupContext> = Symbol('VsOptionGroup')
