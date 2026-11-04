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
  <!-- open above the input (flips automatically when there is no room) -->
  <VsSelect v-model="value" placement="top" placeholder="Opens upward">
    <VsOption value="a" label="Option A" />
    <VsOption value="b" label="Option B" />
  </VsSelect>

  <!-- render inside the component instead of <body>, with a custom class -->
  <VsSelect v-model="value" :teleported="false" popper-class="my-dropdown" placeholder="Not teleported">
    <VsOption value="a" label="Option A" />
    <VsOption value="b" label="Option B" />
  </VsSelect>
</template>

<style>
.my-dropdown {
  border-color: #3b6ef5;
}
</style>
