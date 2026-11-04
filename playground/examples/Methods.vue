<script setup>
import { ref } from 'vue'

const selectRef = ref()
const value = ref('banana')
</script>

<template>
  <VsSelect ref="selectRef" v-model="value">
    <VsOption value="apple" label="Apple" />
    <VsOption value="banana" label="Banana" />
  </VsSelect>
  <button type="button" @click="selectRef.focus()">focus()</button>
  <button type="button" @click="selectRef.toggleMenu()">toggleMenu()</button>
  <span>selectedLabel: {{ selectRef?.selectedLabel }}</span>
</template>
