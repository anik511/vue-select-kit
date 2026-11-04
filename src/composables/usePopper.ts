import { nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import type { Placement } from '../types'

const GAP = 4

/** Positions the dropdown under (or above, when there is no room) the trigger. */
export function usePopper(
  trigger: Ref<HTMLElement | undefined>,
  popper: Ref<HTMLElement | undefined>,
  visible: Ref<boolean>,
  options: { teleported: () => boolean; placement: () => Placement },
) {
  const style = ref<Record<string, string>>({})
  const actualPlacement = ref<Placement>(options.placement())

  function update() {
    const t = trigger.value
    if (!t) return
    const rect = t.getBoundingClientRect()
    const popperHeight = popper.value?.offsetHeight ?? 0
    const below = window.innerHeight - rect.bottom
    const above = rect.top

    let placement = options.placement()
    if (placement === 'bottom' && below < popperHeight + GAP && above > below) placement = 'top'
    else if (placement === 'top' && above < popperHeight + GAP && below > above) placement = 'bottom'
    actualPlacement.value = placement

    if (options.teleported()) {
      const top = placement === 'bottom' ? rect.bottom + GAP : rect.top - popperHeight - GAP
      style.value = {
        position: 'fixed',
        top: `${top}px`,
        left: `${rect.left}px`,
        minWidth: `${rect.width}px`,
      }
    } else {
      style.value = {
        position: 'absolute',
        left: '0',
        minWidth: `${rect.width}px`,
        ...(placement === 'bottom'
          ? { top: `calc(100% + ${GAP}px)` }
          : { bottom: `calc(100% + ${GAP}px)` }),
      }
    }
  }

  function bind() {
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
  }
  function unbind() {
    window.removeEventListener('scroll', update, true)
    window.removeEventListener('resize', update)
  }

  watch(visible, async (open) => {
    if (open) {
      update()
      await nextTick()
      update()
      bind()
    } else {
      unbind()
    }
  })

  onBeforeUnmount(unbind)

  return { style, actualPlacement, update }
}
