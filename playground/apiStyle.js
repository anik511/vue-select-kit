import { ref, watch } from 'vue'

// Composition / Options API preference shared by every code sample, remembered per browser.
const KEY = 'vsk-api-style'

function load() {
  try {
    return localStorage.getItem(KEY) === 'options' ? 'options' : 'composition'
  } catch {
    return 'composition'
  }
}

export const apiStyle = ref(load())

watch(apiStyle, (value) => {
  try {
    localStorage.setItem(KEY, value)
  } catch {
    // storage unavailable — the choice just isn't remembered
  }
})
