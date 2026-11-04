<script>
export default {
  data() {
    return {
      value: '',
      // items with a children array become groups
      options: [
        { name: 'Asia', children: [{ id: 'pk', name: 'Pakistan' }, { id: 'jp', name: 'Japan' }] },
        { name: 'Europe', children: [{ id: 'fr', name: 'France' }, { id: 'de', name: 'Germany', off: true }] },
        { id: 'aq', name: 'Antarctica' },
      ],
      // map your own field names
      mapping: { label: 'name', value: 'id', disabled: 'off', options: 'children' },
    }
  },
}
</script>

<template>
  <VsSelect v-model="value" :options="options" :props="mapping" filterable clearable placeholder="From data">
    <template #option="{ item }">
      {{ item.label }}&nbsp;<small style="color: #8a8f99">({{ item.value }})</small>
    </template>
  </VsSelect>
  <p>Value: {{ value || '—' }}</p>
</template>
