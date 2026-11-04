<script setup>
import { ref } from 'vue'

const value = ref(['apple', 'banana', 'cherry', 'grape'])
const options = ['Apple', 'Banana', 'Cherry', 'Grape', 'Mango', 'Orange'].map((label) => ({
  value: label.toLowerCase(),
  label,
}))
</script>

<template>
  <!-- show one tag, then "+ N" -->
  <VsSelect v-model="value" multiple collapse-tags style="width: 240px">
    <VsOption v-for="item in options" :key="item.value" v-bind="item" />
  </VsSelect>

  <!-- show two tags; hover "+ N" to see (and remove) the rest -->
  <VsSelect v-model="value" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="2" style="width: 280px">
    <VsOption v-for="item in options" :key="item.value" v-bind="item" />
  </VsSelect>
</template>
