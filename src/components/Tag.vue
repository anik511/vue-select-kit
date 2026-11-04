<script setup lang="ts">
defineOptions({ name: 'VsTag' })

defineProps<{ closable?: boolean; info?: boolean }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <span class="vs-tag" :class="{ 'is-info': info }">
    <span class="vs-tag__text"><slot /></span>
    <button
      v-if="closable"
      type="button"
      class="vs-tag__close"
      tabindex="-1"
      aria-label="Remove"
      @mousedown.prevent
      @click.stop="emit('close')"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4.5 4.5l7 7m0-7l-7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
    </button>
  </span>
</template>
