// Code samples for the guide sections. Kept in a .js file because a literal
// closing script tag inside a .vue file would end its script block.
const close = '</' + 'script>'

export const install = `npm install vue-select-kit`

export const registerGlobal = `// main.js (or main.ts)
import { createApp } from 'vue'
import VueSelectKit from 'vue-select-kit'
import 'vue-select-kit/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(VueSelectKit) // registers <VsSelect>, <VsOption>, <VsOptionGroup>
app.mount('#app')`

export const registerPrefix = `// change the component prefix
app.use(VueSelectKit, { prefix: 'My' }) // <MySelect>, <MyOption>, <MyOptionGroup>`

// Samples that differ between the two API styles are { composition, options } pairs.

export const registerLocal = {
  composition: `<script setup>
// components imported in <script setup> are usable in the template directly
import { VsSelect, VsOption, VsOptionGroup } from 'vue-select-kit'
import 'vue-select-kit/style.css'
${close}`,
  options: `<script>
import { VsSelect, VsOption, VsOptionGroup } from 'vue-select-kit'
import 'vue-select-kit/style.css'

export default {
  components: { VsSelect, VsOption, VsOptionGroup },
}
${close}`,
}

export const umd = `<!-- once published to npm; or serve the files from dist/ yourself -->
<link rel="stylesheet" href="https://unpkg.com/vue-select-kit/dist/style.css" />
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/vue-select-kit/dist/vue-select-kit.umd.cjs"></script>

<div id="app">
  <vs-select v-model="value" clearable>
    <vs-option value="a" label="Option A"></vs-option>
    <vs-option value="b" label="Option B"></vs-option>
  </vs-select>
</div>

<script>
  const app = Vue.createApp({
    data: () => ({ value: '' }),
  })
  app.use(VueSelectKit.default)
  app.mount('#app')
${close}`

export const quickStart = {
  composition: `<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'grape', label: 'Grape' },
]

function onChange(val) {
  console.log('selected:', val)
}
${close}

<template>
  <VsSelect v-model="value" multiple filterable clearable placeholder="Pick fruits" @change="onChange">
    <VsOption v-for="o in options" :key="o.value" :value="o.value" :label="o.label" />
  </VsSelect>
</template>`,
  options: `<script>
export default {
  data() {
    return {
      value: [],
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'grape', label: 'Grape' },
      ],
    }
  },
  methods: {
    onChange(val) {
      console.log('selected:', val)
    },
  },
}
${close}

<template>
  <VsSelect v-model="value" multiple filterable clearable placeholder="Pick fruits" @change="onChange">
    <VsOption v-for="o in options" :key="o.value" :value="o.value" :label="o.label" />
  </VsSelect>
</template>`,
}

export const templateRef = {
  composition: `<script setup>
import { ref } from 'vue'

const select = ref()   // same name as ref="select"

function open() {
  select.value.toggleMenu()
  console.log(select.value.selectedLabel)
}
${close}

<template>
  <VsSelect ref="select" v-model="value">...</VsSelect>
</template>`,
  options: `<script>
export default {
  methods: {
    open() {
      this.$refs.select.toggleMenu()
      console.log(this.$refs.select.selectedLabel)
    },
  },
}
${close}

<template>
  <VsSelect ref="select" v-model="value">...</VsSelect>
</template>`,
}

export const typescript = {
  composition: `<script setup lang="ts">
import { ref } from 'vue'
import type { OptionData, SelectProps } from 'vue-select-kit'

const value = ref<string[]>([])

// props, events and slots are type-checked in templates:
// <VsSelect size="huge" />  → error: '"huge"' is not assignable to type 'SelectSize'
${close}`,
  options: `<script lang="ts">
import { defineComponent } from 'vue'
import type { OptionData } from 'vue-select-kit'

export default defineComponent({
  data() {
    return {
      value: [] as string[],
      lastRemoved: null as OptionData['value'] | null,
    }
  },
  methods: {
    onRemoveTag(value: OptionData['value']) {
      this.lastRemoved = value
    },
  },
})
// props, events and slots are type-checked in templates as well
${close}`,
}

export const optionDataType = `interface OptionData {
  key: any        // identity (value, or value[valueKey] for objects)
  value: any
  label: string
  disabled: boolean
  created?: boolean               // true for allow-create rows
  raw?: Record<string, any>       // original item (options prop only)
}`

export const theming = `/* globally */
:root {
  --vs-primary: #10b981;
  --vs-radius: 4px;
}

/* or for one instance */
.my-select {
  --vs-primary: #e11d48;
  --vs-height: 36px;
}`
