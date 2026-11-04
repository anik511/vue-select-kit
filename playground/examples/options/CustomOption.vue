<script>
export default {
  data() {
    return {
      value: '',
      cities: [
        { value: 'karachi', label: 'Karachi', code: 'KHI' },
        { value: 'lahore', label: 'Lahore', code: 'LHE' },
        { value: 'london', label: 'London', code: 'LON' },
        { value: 'tokyo', label: 'Tokyo', code: 'TYO' },
      ],
    }
  },
}
</script>

<template>
  <VsSelect v-model="value" placeholder="Pick a city">
    <VsOption v-for="city in cities" :key="city.value" :value="city.value" :label="city.label">
      <span>{{ city.label }}</span>
      <span style="margin-left: 12px; color: #8a8f99; font-size: 12px">{{ city.code }}</span>
    </VsOption>
  </VsSelect>
</template>
