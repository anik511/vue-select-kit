<script setup>
import { ref } from 'vue'

const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana']

const value = ref([])
const options = ref([])
const loading = ref(false)

// replace the timeout with your API call
function remoteMethod(query) {
  if (!query) {
    options.value = []
    return
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    options.value = states
      .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
      .map((s) => ({ value: s, label: s }))
  }, 500)
}
</script>

<template>
  <VsSelect
    v-model="value"
    multiple
    filterable
    remote
    :remote-method="remoteMethod"
    :remote-delay="300"
    :loading="loading"
    placeholder="Search US states"
    style="width: 320px"
  >
    <VsOption v-for="item in options" :key="item.value" v-bind="item" />
  </VsSelect>
</template>
