<script setup lang="ts">
defineOptions({ name: 'VsOptionItem' })

defineProps<{
  id: string
  label: string
  disabled?: boolean
  selected?: boolean
  hovered?: boolean
  created?: boolean
  multiple?: boolean
  height?: number
}>()

const emit = defineEmits<{ select: []; hover: [] }>()
</script>

<template>
  <li
    :id="id"
    class="vs-option"
    :class="{ 'is-disabled': disabled, 'is-selected': selected, 'is-hovered': hovered, 'is-created': created }"
    role="option"
    :aria-selected="selected"
    :aria-disabled="disabled || undefined"
    :style="height ? { height: `${height}px`, lineHeight: `${height}px` } : undefined"
    @mouseenter="!disabled && emit('hover')"
    @click.stop="!disabled && emit('select')"
  >
    <span class="vs-option__label"><slot>{{ label }}</slot></span>
    <svg v-if="multiple && selected" class="vs-option__check" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </li>
</template>
