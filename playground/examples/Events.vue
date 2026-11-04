<script setup>
import { ref } from 'vue'

const value = ref([])
const log = ref([])

function record(name, payload) {
  const text = payload === undefined ? '' : JSON.stringify(payload)
  log.value = [`${name} ${text}`, ...log.value].slice(0, 6)
}
</script>

<template>
  <VsSelect
    v-model="value"
    multiple
    clearable
    style="width: 300px"
    @change="(v) => record('change', v)"
    @visible-change="(v) => record('visible-change', v)"
    @remove-tag="(v) => record('remove-tag', v)"
    @clear="record('clear')"
    @focus="record('focus')"
    @blur="record('blur')"
  >
    <VsOption value="apple" label="Apple" />
    <VsOption value="banana" label="Banana" />
    <VsOption value="grape" label="Grape" />
  </VsSelect>
  <pre class="event-log">{{ log.join('\n') || 'Interact with the select…' }}</pre>
</template>

<style scoped>
.event-log {
  width: 100%;
  margin: 0;
  padding: 8px 12px;
  font-size: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}
</style>
