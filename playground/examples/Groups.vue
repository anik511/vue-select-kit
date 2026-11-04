<script setup>
import { ref } from 'vue'

const value = ref('')
const groups = [
  { label: 'Fruits', options: [{ value: 'apple', label: 'Apple' }, { value: 'banana', label: 'Banana' }] },
  { label: 'Vegetables', options: [{ value: 'carrot', label: 'Carrot' }, { value: 'potato', label: 'Potato' }] },
  { label: 'Out of season', disabled: true, options: [{ value: 'kale', label: 'Kale' }] },
]
</script>

<template>
  <VsSelect v-model="value" filterable placeholder="Grouped options">
    <VsOptionGroup v-for="group in groups" :key="group.label" :label="group.label" :disabled="group.disabled">
      <VsOption v-for="item in group.options" :key="item.value" v-bind="item" />
    </VsOptionGroup>
  </VsSelect>
</template>
