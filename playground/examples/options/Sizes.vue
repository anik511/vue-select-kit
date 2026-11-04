<script>
export default {
  data() {
    return {
      value: '',
    }
  },
}
</script>

<template>
  <VsSelect v-model="value" size="large" placeholder="Large">
    <VsOption value="apple" label="Apple" />
    <VsOption value="banana" label="Banana" />
  </VsSelect>
  <VsSelect v-model="value" placeholder="Default">
    <VsOption value="apple" label="Apple" />
    <VsOption value="banana" label="Banana" />
  </VsSelect>
  <VsSelect v-model="value" size="small" placeholder="Small">
    <VsOption value="apple" label="Apple" />
    <VsOption value="banana" label="Banana" />
  </VsSelect>
</template>
