<script setup>
import { apiStyle } from '../apiStyle.js'

defineProps({ small: Boolean })

const choices = [
  { value: 'composition', label: 'Composition API' },
  { value: 'options', label: 'Options API' },
]
</script>

<template>
  <div class="api-switch" :class="{ 'is-small': small }" role="radiogroup" aria-label="API style">
    <button
      v-for="c in choices"
      :key="c.value"
      type="button"
      role="radio"
      :aria-checked="apiStyle === c.value"
      :class="{ 'is-active': apiStyle === c.value }"
      @click="apiStyle = c.value"
    >
      {{ c.label }}
    </button>
  </div>
</template>
