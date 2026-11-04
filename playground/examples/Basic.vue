<script setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
]
</script>

<template>
  <VsSelect v-model="value" placeholder="Pick a fruit">
    <VsOption v-for="item in options" :key="item.value" :value="item.value" :label="item.label" />
  </VsSelect>
  <p>Selected: {{ value || '—' }}</p>
</template>
