<script>
export default {
  data() {
    return {
      value: undefined,
      tags: [],
      // freeze large static lists so Vue skips making them reactive
      options: Object.freeze(Array.from({ length: 10000 }, (_, i) => ({ value: i, label: `Option ${i + 1}` }))),
    }
  },
}
</script>

<template>
  <!-- only the visible rows are rendered -->
  <VsSelect v-model="value" :options="options" virtual filterable clearable placeholder="10,000 options" />

  <VsSelect
    v-model="tags"
    :options="options"
    virtual
    multiple
    filterable
    collapse-tags
    :height="200"
    :item-height="30"
    placeholder="Virtual + multiple"
    style="width: 280px"
  />
</template>
