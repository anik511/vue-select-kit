<script>
export default {
  data() {
    return {
      value: 'pro',
      tags: ['red', 'blue'],
      plans: [
        { value: 'free', label: 'Free' },
        { value: 'pro', label: 'Pro' },
        { value: 'team', label: 'Team' },
      ],
      colors: ['red', 'green', 'blue'],
    }
  },
}
</script>

<template>
  <!-- prefix, label, header and footer slots -->
  <VsSelect v-model="value" style="width: 260px">
    <template #prefix>💳</template>
    <template #label="{ label }"><b>{{ label }}</b>&nbsp;plan</template>
    <template #header><small>Choose a plan</small></template>
    <VsOption v-for="p in plans" :key="p.value" v-bind="p" />
    <template #footer><a href="#" @click.prevent>Compare plans →</a></template>
  </VsSelect>

  <!-- custom tags -->
  <VsSelect v-model="tags" multiple style="width: 260px">
    <template #tag="{ option, close }">
      <span class="color-tag" :style="{ background: option.value }" @click.stop="close">{{ option.label }} ✕</span>
    </template>
    <VsOption v-for="c in colors" :key="c" :value="c" />
  </VsSelect>

  <!-- empty slot -->
  <VsSelect placeholder="No options">
    <template #empty>🤷 Nothing to show</template>
  </VsSelect>
</template>

<style scoped>
.color-tag {
  padding: 2px 8px;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}
</style>
