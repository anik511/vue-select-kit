import type { Ref } from 'vue'

interface KeyboardOptions {
  visible: Ref<boolean>
  hoverKey: Ref<any>
  /** Selectable option keys in display order. */
  navigableKeys: () => any[]
  open: () => void
  close: () => void
  selectHovered: () => void
  removeLast: () => void
  canRemoveLast: () => boolean
  scrollToKey: (key: any) => void
}

export function useKeyboard(o: KeyboardOptions) {
  function move(step: 1 | -1) {
    const keys = o.navigableKeys()
    if (!keys.length) return
    const current = keys.indexOf(o.hoverKey.value)
    const next =
      current === -1 ? (step === 1 ? 0 : keys.length - 1) : (current + step + keys.length) % keys.length
    o.hoverKey.value = keys[next]
    o.scrollToKey(keys[next])
  }

  function onKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault()
        if (!o.visible.value) o.open()
        else move(e.key === 'ArrowDown' ? 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (!o.visible.value) o.open()
        else if (o.hoverKey.value !== undefined && o.navigableKeys().includes(o.hoverKey.value)) o.selectHovered()
        else o.close()
        break
      case 'Escape':
        if (o.visible.value) {
          e.preventDefault()
          e.stopPropagation()
          o.close()
        }
        break
      case 'Tab':
        o.close()
        break
      case 'Backspace':
        if (o.canRemoveLast()) o.removeLast()
        break
    }
  }

  return { onKeydown, move }
}
