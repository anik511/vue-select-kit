<script setup>
import { ref } from 'vue'

const value = ref('banana')
const cleared = ref(0)
</script>

<template>
  <VsSelect v-model="value" clearable placeholder="Hover me to clear" @clear="cleared++">
    <VsOption value="apple" label="Apple" />
    <VsOption value="banana" label="Banana" />
    <VsOption value="grape" label="Grape" />
  </VsSelect>
  <p>Cleared {{ cleared }} time(s)</p>
</template>
