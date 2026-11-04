<script setup lang="ts" generic="T">
import { computed, ref } from 'vue'

defineOptions({ name: 'VsVirtualList' })

const props = withDefaults(
  defineProps<{
    items: T[]
    itemHeight: number
    height: number
    itemKey: (item: T, index: number) => string | number
    buffer?: number
  }>(),
  { buffer: 4 },
)

defineSlots<{ default(props: { item: T; index: number }): any }>()

const root = ref<HTMLElement>()
const scrollTop = ref(0)

const totalHeight = computed(() => props.items.length * props.itemHeight)
const viewportHeight = computed(() => Math.min(props.height, totalHeight.value))
const start = computed(() => Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer))
const end = computed(() =>
  Math.min(
    props.items.length,
    Math.ceil((scrollTop.value + props.height) / props.itemHeight) + props.buffer,
  ),
)
const visibleItems = computed(() => props.items.slice(start.value, end.value))

function onScroll() {
  scrollTop.value = root.value?.scrollTop ?? 0
}

function scrollToIndex(index: number) {
  const el = root.value
  if (!el || index < 0) return
  const top = index * props.itemHeight
  const bottom = top + props.itemHeight
  const viewport = el.clientHeight || viewportHeight.value
  if (top < el.scrollTop) el.scrollTop = top
  else if (bottom > el.scrollTop + viewport) el.scrollTop = bottom - viewport
  onScroll()
}

defineExpose({ scrollToIndex })
</script>

<template>
  <div ref="root" class="vs-virtual-list" :style="{ height: `${viewportHeight}px` }" @scroll="onScroll">
    <div class="vs-virtual-list__phantom" :style="{ height: `${totalHeight}px` }">
      <ul class="vs-virtual-list__content" :style="{ transform: `translateY(${start * itemHeight}px)` }">
        <template v-for="(item, i) in visibleItems" :key="itemKey(item, start + i)">
          <slot :item="item" :index="start + i" />
        </template>
      </ul>
    </div>
  </div>
</template>
