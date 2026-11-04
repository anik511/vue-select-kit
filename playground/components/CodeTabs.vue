<script setup>
import { apiStyle } from '../apiStyle.js'
import ApiSwitch from './ApiSwitch.vue'
import CodeBlock from './CodeBlock.vue'

// a code sample with a Composition API and an Options API variant
defineProps({
  composition: { type: String, required: true },
  options: { type: String, required: true },
  lang: { type: String, default: 'vue' },
})
</script>

<template>
  <div class="code-tabs">
    <ApiSwitch small />
    <CodeBlock :code="apiStyle === 'options' ? options : composition" :lang="lang" />
  </div>
</template>
