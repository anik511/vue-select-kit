export const selectProps = [
  ['model-value / v-model', 'Selected value. An array when <code>multiple</code>.', 'any', '—'],
  ['multiple', 'Allow selecting several values (shown as tags).', 'boolean', 'false'],
  ['disabled', 'Disable the whole select.', 'boolean', 'false'],
  ['clearable', 'Show a clear button on hover or focus while a value is set.', 'boolean', 'false'],
  ['placeholder', 'Placeholder text.', 'string', "'Select'"],
  ['size', 'Component size.', "'large' | 'default' | 'small'", "'default'"],
  ['value-key', 'Identity field when values are objects.', 'string', "'value'"],
  ['filterable', 'Allow typing to filter options.', 'boolean', 'false'],
  ['filter-method', 'Custom filter. Turns off built-in filtering; update your options yourself.', '(query: string) => void', '—'],
  ['remote', 'Options come from a server. Requires <code>filterable</code>.', 'boolean', 'false'],
  ['remote-method', 'Called with the query (debounced).', '(query: string) => void', '—'],
  ['remote-delay', 'Debounce delay for <code>remote-method</code>, in ms.', 'number', '300'],
  ['loading', 'Show the loading state instead of the options.', 'boolean', 'false'],
  ['loading-text', 'Text shown while loading.', 'string', "'Loading'"],
  ['no-match-text', 'Text shown when filtering finds nothing.', 'string', "'No matching data'"],
  ['no-data-text', 'Text shown when there are no options.', 'string', "'No data'"],
  ['allow-create', 'Let the user create options from the typed text. Requires <code>filterable</code>.', 'boolean', 'false'],
  ['default-first-option', 'Highlight the first match while filtering, so Enter picks it.', 'boolean', 'false'],
  ['reserve-keyword', 'Keep the typed query after selecting (multiple + filterable).', 'boolean', 'true'],
  ['multiple-limit', 'Maximum number of selections. <code>0</code> means no limit.', 'number', '0'],
  ['collapse-tags', 'Collapse tags into a "+ N" counter.', 'boolean', 'false'],
  ['collapse-tags-tooltip', 'Show the collapsed tags on hover.', 'boolean', 'false'],
  ['max-collapse-tags', 'Number of tags shown before collapsing.', 'number', '1'],
  ['teleported', 'Render the dropdown in <code>&lt;body&gt;</code>.', 'boolean', 'true'],
  ['popper-class', 'Extra class for the dropdown.', 'string', '—'],
  ['placement', 'Preferred dropdown side. Flips when there is no room.', "'bottom' | 'top'", "'bottom'"],
  ['options', 'Data-driven options. Items with a children array become groups.', 'Record&lt;string, any&gt;[]', '—'],
  ['props', 'Field names used by <code>options</code>.', '{ label?, value?, disabled?, options? }', "{ label: 'label', value: 'value', disabled: 'disabled', options: 'options' }"],
  ['virtual', 'Virtual scrolling. Works with <code>options</code> only.', 'boolean', 'false'],
  ['height', 'Maximum dropdown list height, in px.', 'number', '274'],
  ['item-height', 'Row height for virtual scrolling, in px.', 'number', '34'],
  ['name', 'Native <code>name</code> of the input.', 'string', '—'],
  ['id', 'Native <code>id</code> of the input; also the prefix for option ids.', 'string', '—'],
]

export const selectEvents = [
  ['update:modelValue', 'The value changed (used by <code>v-model</code>).', '(value: any)'],
  ['change', 'The value actually changed through user interaction.', '(value: any)'],
  ['visible-change', 'The dropdown opened or closed.', '(visible: boolean)'],
  ['remove-tag', 'A tag was removed in multiple mode.', '(value: any)'],
  ['clear', 'The clear button was clicked.', '()'],
  ['focus', 'The input gained focus.', '(event: FocusEvent)'],
  ['blur', 'The input lost focus.', '(event: FocusEvent)'],
]

export const selectSlots = [
  ['default', 'The <code>&lt;VsOption&gt;</code> / <code>&lt;VsOptionGroup&gt;</code> children.', '—'],
  ['prefix', 'Content before the input.', '—'],
  ['label', 'Display of the selected value (single mode).', '{ label: string, value: any }'],
  ['tag', 'Each tag (multiple mode). Call <code>close()</code> to remove it.', '{ option: OptionData, close: () =&gt; void }'],
  ['option', 'Each row when using the <code>options</code> prop.', '{ item: OptionData }'],
  ['header', 'Top of the dropdown.', '—'],
  ['footer', 'Bottom of the dropdown.', '—'],
  ['empty', 'Shown when there are no (matching) options.', '—'],
  ['loading', 'Shown while <code>loading</code> is true.', '—'],
]

export const selectExposes = [
  ['focus', 'Focus the input.', '() =&gt; void'],
  ['blur', 'Blur the input.', '() =&gt; void'],
  ['toggleMenu', 'Open or close the dropdown.', '() =&gt; void'],
  ['selectedLabel', 'Label(s) of the current value.', 'string | string[]'],
]

export const optionProps = [
  ['value', 'Option value. <b>Required.</b>', 'any', '—'],
  ['label', 'Text shown in the input, tags and list, and used for filtering. Defaults to <code>value</code>.', 'string | number', '—'],
  ['disabled', 'Disable this option.', 'boolean', 'false'],
]

export const optionSlots = [['default', 'Custom content of the option row.', '—']]

export const groupProps = [
  ['label', 'Group title.', 'string', '—'],
  ['disabled', 'Disable every option in the group.', 'boolean', 'false'],
]

export const groupSlots = [['default', 'The <code>&lt;VsOption&gt;</code>s of this group.', '—']]

export const keyboard = [
  ['↓ / ↑', 'Open the dropdown, then move the highlight (disabled options are skipped).'],
  ['Enter', 'Select the highlighted option, or open the dropdown.'],
  ['Esc', 'Close the dropdown.'],
  ['Tab', 'Close the dropdown and move focus on.'],
  ['Backspace', 'With an empty search box in multiple mode, remove the last tag.'],
]

export const cssVars = [
  ['--vs-primary', 'Focus border, selected option color', '#3b6ef5'],
  ['--vs-text', 'Text color', '#303133'],
  ['--vs-text-muted', 'Icons, group titles, empty text', '#8a8f99'],
  ['--vs-placeholder', 'Placeholder and disabled text', '#a8abb2'],
  ['--vs-border', 'Border color', '#dcdfe6'],
  ['--vs-border-hover', 'Border color on hover', '#c0c4cc'],
  ['--vs-bg', 'Input and dropdown background', '#ffffff'],
  ['--vs-bg-disabled', 'Disabled input background', '#f5f7fa'],
  ['--vs-hover', 'Highlighted option background', '#f5f7fa'],
  ['--vs-tag-bg', 'Tag background', '#f0f2f5'],
  ['--vs-radius', 'Corner radius', '6px'],
  ['--vs-shadow', 'Dropdown shadow', '0 6px 20px rgba(0,0,0,.12)'],
  ['--vs-height', 'Input height (set per size)', '32px'],
  ['--vs-font-size', 'Font size (set per size)', '14px'],
  ['--vs-z-index', 'Dropdown z-index', '2000'],
]
