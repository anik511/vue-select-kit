<script>
export default {
  data() {
    return {
      users: [
        { id: 1, name: 'Ayesha', role: 'Admin' },
        { id: 2, name: 'Bilal', role: 'Editor' },
        { id: 3, name: 'Chen', role: 'Viewer' },
      ],
      // a different object with the same id still matches
      value: { id: 2, name: 'Bilal', role: 'Editor' },
    }
  },
}
</script>

<template>
  <VsSelect v-model="value" value-key="id" placeholder="Pick a user">
    <VsOption v-for="u in users" :key="u.id" :value="u" :label="u.name" />
  </VsSelect>
  <p>Value: {{ value }}</p>
</template>
