<script setup>
import { ref } from 'vue'

const all = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape']
const list = ref(all)
const value = ref('')

// match only from the start of the label
function filterMethod(query) {
  const q = query.toLowerCase()
  list.value = q ? all.filter((item) => item.toLowerCase().startsWith(q)) : all
}
</script>

<template>
  <VsSelect v-model="value" filterable :filter-method="filterMethod" placeholder="Starts with…">
    <VsOption v-for="item in list" :key="item" :value="item" />
  </VsSelect>
</template>
