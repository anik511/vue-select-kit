<script setup>
import { ref } from 'vue'

const value = ref('')
const disabledValue = ref('apple')
</script>

<template>
  <!-- disable single options -->
  <VsSelect v-model="value" placeholder="Some options disabled">
    <VsOption value="apple" label="Apple" />
    <VsOption value="banana" label="Banana" disabled />
    <VsOption value="cherry" label="Cherry" disabled />
    <VsOption value="grape" label="Grape" />
  </VsSelect>

  <!-- disable the whole select -->
  <VsSelect v-model="disabledValue" disabled>
    <VsOption value="apple" label="Apple" />
  </VsSelect>
</template>
