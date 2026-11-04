export type SelectSize = 'large' | 'default' | 'small'
export type Placement = 'bottom' | 'top'

/** Key mapping used by the data-driven `options` prop. */
export interface OptionPropsMapping {
  label?: string
  value?: string
  disabled?: string
  options?: string
}

export interface SelectProps {
  modelValue?: any
  multiple?: boolean
  disabled?: boolean
  clearable?: boolean
  placeholder?: string
  size?: SelectSize
  /** Path of the identity field when values are objects. */
  valueKey?: string
  filterable?: boolean
  /** Custom filter. When set, built-in filtering is disabled and you update options yourself. */
  filterMethod?: (query: string) => void
  remote?: boolean
  remoteMethod?: (query: string) => void
  remoteDelay?: number
  loading?: boolean
  loadingText?: string
  noMatchText?: string
  noDataText?: string
  allowCreate?: boolean
  defaultFirstOption?: boolean
  reserveKeyword?: boolean
  multipleLimit?: number
  collapseTags?: boolean
  collapseTagsTooltip?: boolean
  maxCollapseTags?: number
  teleported?: boolean
  popperClass?: string
  placement?: Placement
  /** Data-driven options (required for `virtual`). Items with a children array become groups. */
  options?: Record<string, any>[]
  props?: OptionPropsMapping
  virtual?: boolean
  /** Max dropdown list height in px. */
  height?: number
  /** Row height in px for virtual scrolling. */
  itemHeight?: number
  name?: string
  id?: string
}

export interface OptionProps {
  value: any
  label?: string | number
  disabled?: boolean
}

export interface OptionGroupProps {
  label?: string
  disabled?: boolean
}

/** Normalized option, as stored internally and passed to slots. */
export interface OptionData {
  key: any
  value: any
  label: string
  disabled: boolean
  created?: boolean
  /** The raw item from the `options` prop (data mode only). */
  raw?: Record<string, any>
}

export type DropdownRow =
  | { type: 'group'; label: string; id: string }
  | { type: 'option'; option: OptionData }
