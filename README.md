# vue-select-kit

A feature-rich select component for Vue 3: single/multiple, tags, filtering, remote search, option groups, allow-create, virtual scrolling. Written in TypeScript, shipped as plain JS + `.d.ts`, so it works in **both JavaScript and TypeScript** Vue 3 projects. No runtime dependencies besides `vue` (≥ 3.3).

## Install

```bash
npm i vue-select-kit
```

```js
// main.js / main.ts
import { createApp } from 'vue'
import VueSelectKit from 'vue-select-kit'
import 'vue-select-kit/style.css'
import App from './App.vue'

createApp(App).use(VueSelectKit).mount('#app')            // <VsSelect>, <VsOption>, <VsOptionGroup>
// createApp(App).use(VueSelectKit, { prefix: 'My' })      // <MySelect>, ...
```

Or import per component:

```js
import { VsSelect, VsOption, VsOptionGroup } from 'vue-select-kit'
import 'vue-select-kit/style.css'
```

UMD (`<script>`): load `vue` first, then `dist/vue-select-kit.umd.cjs`; the global is `VueSelectKit`.

## Usage

```vue
<VsSelect v-model="value" clearable filterable placeholder="Pick one">
  <VsOption v-for="o in options" :key="o.value" :value="o.value" :label="o.label" :disabled="o.disabled" />
</VsSelect>

<VsSelect v-model="tags" multiple collapse-tags collapse-tags-tooltip :multiple-limit="5" />

<VsSelect v-model="v" filterable allow-create default-first-option multiple />

<VsSelect v-model="v" filterable remote :remote-method="search" :loading="loading">
  <VsOption v-for="o in results" :key="o.value" v-bind="o" />
</VsSelect>

<VsSelect v-model="v">
  <VsOptionGroup label="Fruits" :disabled="false">
    <VsOption value="apple" label="Apple" />
  </VsOptionGroup>
</VsSelect>

<!-- data-driven (required for virtual scroll); items with an `options` array become groups -->
<VsSelect v-model="v" :options="list" :props="{ label: 'name', value: 'id' }" virtual filterable>
  <template #option="{ item }">{{ item.label }}</template>
</VsSelect>
```

Object values: pass `value-key` (default `'value'`) naming the identity field, e.g. `value-key="id"`.

## Select props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` / `v-model` | `any` (array when `multiple`) | — |
| `multiple`, `disabled`, `clearable`, `filterable` | `boolean` | `false` |
| `placeholder` | `string` | `'Select'` |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` |
| `valueKey` | `string` | `'value'` |
| `filterMethod` | `(query) => void`, disables built-in filtering | — |
| `remote`, `remoteMethod`, `remoteDelay` | `boolean`, `(query) => void`, `number` (ms) | `false`, —, `300` |
| `loading`, `loadingText` | `boolean`, `string` | `false`, `'Loading'` |
| `noMatchText`, `noDataText` | `string` | `'No matching data'`, `'No data'` |
| `allowCreate`, `defaultFirstOption` | `boolean` (allowCreate needs `filterable`) | `false` |
| `reserveKeyword` | keep query after selecting (multiple) | `true` |
| `multipleLimit` | `number` (0 = unlimited) | `0` |
| `collapseTags`, `collapseTagsTooltip`, `maxCollapseTags` | `boolean`, `boolean`, `number` | `false`, `false`, `1` |
| `teleported` | render dropdown in `<body>` | `true` |
| `popperClass`, `placement` | `string`, `'bottom' \| 'top'` (auto-flips) | —, `'bottom'` |
| `options`, `props` | data array, `{ label, value, disabled, options }` key map | — |
| `virtual`, `height`, `itemHeight` | `boolean`, `number`, `number` (px) | `false`, `274`, `34` |
| `name`, `id` | `string` | — |

**Events:** `update:modelValue`, `change`, `visible-change`, `remove-tag`, `clear`, `focus`, `blur`.

**Slots:** `default` (options), `prefix`, `header`, `footer`, `empty`, `loading`, `label` `{ label, value }`, `tag` `{ option, close }`, `option` `{ item }` (data mode).

**Exposed methods:** `focus()`, `blur()`, `toggleMenu()`, `selectedLabel`.

**`VsOption`:** `value` (required), `label`, `disabled`, default slot for custom content. **`VsOptionGroup`:** `label`, `disabled` (cascades to its options).

## Keyboard

`↑` / `↓` move (skipping disabled), `Enter` selects / opens, `Esc` closes, `Tab` closes, `Backspace` on an empty input removes the last tag.

## Theming

Override the CSS variables, e.g. `:root { --vs-primary: #10b981; --vs-radius: 4px; }`. See `src/styles/select.css` for the full list.

## Notes

- Virtual scrolling only works with the `options` prop. Slot `<VsOption>` children are always rendered in full.
- Mousedown inside the dropdown is prevented so the input keeps focus. Text inputs inside the `header`/`footer` slots won't take focus by click.

## Development

```bash
npm run dev         # documentation site with live examples (playground/)
npm test            # vitest
npm run type-check
npm run build       # dist/: .mjs, .umd.cjs, style.css, types/
```
