<script>
export default {
  data() {
    return {
      value: 'banana',
      label: '',
    }
  },
  mounted() {
    this.label = this.$refs.select.selectedLabel
  },
  methods: {
    focus() {
      this.$refs.select.focus()
    },
    toggle() {
      this.$refs.select.toggleMenu()
    },
  },
  watch: {
    value() {
      this.$nextTick(() => (this.label = this.$refs.select.selectedLabel))
    },
  },
}
</script>

<template>
  <VsSelect ref="select" v-model="value">
    <VsOption value="apple" label="Apple" />
    <VsOption value="banana" label="Banana" />
  </VsSelect>
  <button type="button" @click="focus">focus()</button>
  <button type="button" @click="toggle">toggleMenu()</button>
  <span>selectedLabel: {{ label }}</span>
</template>
