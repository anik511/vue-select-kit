import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/** Calls `handler` on pointer down outside every element in `targets`. */
export function useClickOutside(targets: Ref<HTMLElement | undefined>[], handler: () => void) {
  function onPointerDown(e: Event) {
    const node = e.target as Node | null
    if (!node) return
    if (targets.some((t) => t.value?.contains(node))) return
    handler()
  }
  onMounted(() => document.addEventListener('mousedown', onPointerDown, true))
  onBeforeUnmount(() => document.removeEventListener('mousedown', onPointerDown, true))
}
