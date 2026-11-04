import { onBeforeUnmount } from 'vue'

/** Debounces calls to the remote search method. */
export function useRemote(getMethod: () => ((q: string) => void) | undefined, getDelay: () => number) {
  let timer: ReturnType<typeof setTimeout> | undefined

  function search(query: string) {
    const method = getMethod()
    if (!method) return
    clearTimeout(timer)
    timer = setTimeout(() => method(query), getDelay())
  }

  function cancel() {
    clearTimeout(timer)
  }

  onBeforeUnmount(cancel)

  return { search, cancel }
}
