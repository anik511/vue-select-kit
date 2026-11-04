<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  code: { type: String, required: true },
  lang: { type: String, default: 'vue' },
})

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// one-pass tokenizer on the escaped text, so inserted <span>s are never re-matched
const TOKEN =
  /(&lt;!--[\s\S]*?--&gt;|\/\*[\s\S]*?\*\/)|((?:^|[^:])\/\/[^\n]*)|("[^"\n]*"|'[^'\n]*'|`[^`]*`)|(&lt;\/?[\w-]+|\/?&gt;)|\b(import|from|export|default|const|let|function|return|if|else|true|false|new)\b|([:@#]?[\w.-]+(?==))/g

const html = computed(() =>
  escape(props.code.trim()).replace(TOKEN, (m, comment, lineComment, str, tag, keyword, attr) => {
    if (comment) return `<span class="tk-comment">${comment}</span>`
    if (lineComment) {
      const lead = lineComment.startsWith('//') ? '' : lineComment[0]
      return `${lead}<span class="tk-comment">${lineComment.slice(lead.length)}</span>`
    }
    if (str) return `<span class="tk-string">${str}</span>`
    if (tag) return `<span class="tk-tag">${tag}</span>`
    if (keyword) return `<span class="tk-keyword">${keyword}</span>`
    if (attr) return `<span class="tk-attr">${attr}</span>`
    return m
  }),
)

const copied = ref(false)
async function copy() {
  try {
    await navigator.clipboard.writeText(props.code.trim())
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // clipboard unavailable (e.g. insecure context) — ignore
  }
}
</script>

<template>
  <div class="code-block">
    <span class="code-block__lang">{{ lang }}</span>
    <button type="button" class="code-block__copy" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
    <pre><code v-html="html" /></pre>
  </div>
</template>
