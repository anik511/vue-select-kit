<script setup>
import { ref } from 'vue'

const value = ref('')
const tags = ref([])
const countries = ['Australia', 'Brazil', 'Canada', 'Denmark', 'Egypt', 'France', 'Germany', 'India', 'Japan', 'Pakistan']
</script>

<template>
  <!-- type to filter; Enter selects the first match -->
  <VsSelect v-model="value" filterable default-first-option clearable placeholder="Search a country">
    <VsOption v-for="c in countries" :key="c" :value="c" />
  </VsSelect>

  <!-- multiple + filterable -->
  <VsSelect v-model="tags" multiple filterable placeholder="Search & pick many" style="width: 320px">
    <VsOption v-for="c in countries" :key="c" :value="c" />
  </VsSelect>
</template>
