<script>
export default {
  data() {
    return {
      value: ['vue'],
      options: ['Vue', 'React', 'Svelte', 'Angular'].map((label) => ({ value: label.toLowerCase(), label })),
    }
  },
}
</script>

<template>
  <VsSelect
    v-model="value"
    multiple
    filterable
    allow-create
    default-first-option
    :reserve-keyword="false"
    placeholder="Type and press Enter"
    style="width: 320px"
  >
    <VsOption v-for="item in options" :key="item.value" v-bind="item" />
  </VsSelect>
  <p>Value: {{ value }}</p>
</template>
