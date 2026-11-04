<script>
const all = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape']

export default {
  data() {
    return {
      list: all,
      value: '',
    }
  },
  methods: {
    // match only from the start of the label
    filterMethod(query) {
      const q = query.toLowerCase()
      this.list = q ? all.filter((item) => item.toLowerCase().startsWith(q)) : all
    },
  },
}
</script>

<template>
  <VsSelect v-model="value" filterable :filter-method="filterMethod" placeholder="Starts with…">
    <VsOption v-for="item in list" :key="item" :value="item" />
  </VsSelect>
</template>
