<script setup lang="ts">
import { computed, provide, shallowReactive, type ComputedRef } from 'vue'
import { OPTION_GROUP_KEY } from '../tokens'
import type { OptionGroupProps } from '../types'

defineOptions({ name: 'VsOptionGroup' })

const props = defineProps<OptionGroupProps>()

const children = shallowReactive(new Map<any, ComputedRef<boolean>>())
const visible = computed(() => [...children.values()].some((v) => v.value))

provide(OPTION_GROUP_KEY, {
  disabled: computed(() => !!props.disabled),
  register: (key, isVisible) => children.set(key, isVisible),
  unregister: (key) => children.delete(key),
})
</script>

<template>
  <li v-show="visible" class="vs-option-group" role="presentation">
    <div class="vs-option-group__title">{{ label }}</div>
    <ul class="vs-option-group__list" role="group" :aria-label="label">
      <slot />
    </ul>
  </li>
</template>
