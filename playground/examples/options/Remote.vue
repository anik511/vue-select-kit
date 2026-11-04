<script>
const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana']

export default {
  data() {
    return {
      value: [],
      options: [],
      loading: false,
    }
  },
  methods: {
    // replace the timeout with your API call
    remoteMethod(query) {
      if (!query) {
        this.options = []
        return
      }
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.options = states
          .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
          .map((s) => ({ value: s, label: s }))
      }, 500)
    },
  },
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
