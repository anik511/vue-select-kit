// Each demo's source code is loaded raw from its own file, so the code shown always matches the demo.
const components = import.meta.glob('./*.vue', { eager: true, import: 'default' })
const sources = import.meta.glob('./*.vue', { eager: true, query: '?raw', import: 'default' })

const meta = [
  ['Basic', 'Basic usage', 'Bind the selected value with <code>v-model</code> and list choices with <code>&lt;VsOption&gt;</code>. If you leave out <code>label</code>, the option shows its <code>value</code>.'],
  ['Disabled', 'Disabled', 'Disable individual options with <code>disabled</code> on <code>&lt;VsOption&gt;</code>, or the whole select with <code>disabled</code> on <code>&lt;VsSelect&gt;</code>.'],
  ['Clearable', 'Clearable', 'With <code>clearable</code>, a clear button appears on hover or focus while a value is set. Clearing emits <code>clear</code> and sets the value to <code>undefined</code> (or <code>[]</code> when <code>multiple</code>).'],
  ['Sizes', 'Sizes', 'Use <code>size</code>: <code>large</code>, <code>default</code> or <code>small</code>.'],
  ['Multiple', 'Multiple selection', 'Add <code>multiple</code> and the value becomes an array, shown as tags. Clicking an option toggles it. <code>multiple-limit</code> caps how many can be picked; once the cap is reached, the remaining options are disabled.'],
  ['CollapseTags', 'Collapse tags', '<code>collapse-tags</code> shows the first <code>max-collapse-tags</code> tags and a <code>+ N</code> counter. Add <code>collapse-tags-tooltip</code> to list the hidden tags on hover.'],
  ['Filterable', 'Filterable', '<code>filterable</code> lets the user type to filter options (case-insensitive substring match on the label). <code>default-first-option</code> highlights the first match, so <kbd>Enter</kbd> picks it. Works with <code>multiple</code>.'],
  ['CustomFilter', 'Custom filter method', 'Pass <code>filter-method</code> to turn off built-in filtering. It receives the query, and you update the options yourself.'],
  ['Remote', 'Remote search', 'Set <code>filterable</code> + <code>remote</code> + <code>remote-method</code>. The method is called with the query after <code>remote-delay</code> ms (default 300) of no typing. Toggle <code>loading</code> while the request runs. Labels of selected values are kept even after the options list changes.'],
  ['AllowCreate', 'Create new options', 'With <code>filterable</code> + <code>allow-create</code>, typing text that matches no option label offers a "Create" row. The typed text becomes the value. <code>:reserve-keyword="false"</code> clears the query after each pick.'],
  ['Groups', 'Option groups', 'Wrap options in <code>&lt;VsOptionGroup&gt;</code>. A disabled group disables all of its options. While filtering, groups with no matching options are hidden.'],
  ['CustomOption', 'Custom option template', 'The default slot of <code>&lt;VsOption&gt;</code> replaces how it is rendered in the dropdown. <code>label</code> is still used for the input, tags and filtering.'],
  ['Slots', 'Select slots', 'Customize parts of the select: <code>prefix</code>, <code>label</code> (selected value in single mode), <code>tag</code> (each tag in multiple mode), <code>header</code>, <code>footer</code> and <code>empty</code>.'],
  ['ObjectValue', 'Object values', 'Options can hold objects. Set <code>value-key</code> to the field that identifies them (default <code>value</code>). Values are compared by that field, not by reference.'],
  ['DataOptions', 'Data-driven options', 'Pass an array to <code>options</code> instead of writing <code>&lt;VsOption&gt;</code>s. Items with a children array become groups. Use <code>props</code> to map your own field names, and the <code>option</code> slot (receives <code>{ item }</code>) for custom rows.'],
  ['Virtual', 'Virtual scroll', 'For large lists, combine <code>options</code> with <code>virtual</code>: only the visible rows are rendered. Set <code>height</code> (max list height) and <code>item-height</code> (row height) in px. Works with filtering and multiple selection.'],
  ['Dropdown', 'Dropdown placement', '<code>placement</code> sets the preferred side (<code>bottom</code> or <code>top</code>). The dropdown flips if there is no room. It is teleported to <code>&lt;body&gt;</code> by default; set <code>:teleported="false"</code> to render it in place. <code>popper-class</code> adds a class to it.'],
  ['Events', 'Events', 'Every event the select emits. <code>change</code> fires only when the value actually changes.'],
  ['Methods', 'Exposed methods', 'Use a template ref to call <code>focus()</code>, <code>blur()</code>, <code>toggleMenu()</code> or read <code>selectedLabel</code>.'],
]

export const examples = meta.map(([file, title, description]) => ({
  id: `example-${file.replace(/[A-Z]/g, (c, i) => (i ? '-' : '') + c.toLowerCase())}`,
  file: `${file}.vue`,
  title,
  description,
  component: components[`./${file}.vue`],
  source: sources[`./${file}.vue`],
}))
