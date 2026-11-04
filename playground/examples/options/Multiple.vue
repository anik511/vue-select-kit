<script>
export default {
  data() {
    return {
      value: ['apple'],
      limited: [],
      options: ['Apple', 'Banana', 'Cherry', 'Grape', 'Mango', 'Orange'].map((label) => ({
        value: label.toLowerCase(),
        label,
      })),
    }
  },
}
</script>

<template>
  <VsSelect v-model="value" multiple clearable placeholder="Pick fruits" style="width: 320px">
    <VsOption v-for="item in options" :key="item.value" v-bind="item" />
  </VsSelect>

  <!-- at most 2 selections -->
  <VsSelect v-model="limited" multiple :multiple-limit="2" placeholder="Max 2" style="width: 320px">
    <VsOption v-for="item in options" :key="item.value" v-bind="item" />
  </VsSelect>
  <p>Selected: {{ value }}</p>
</template>
