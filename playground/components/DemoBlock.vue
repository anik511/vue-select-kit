<script setup>
import { ref } from 'vue'
import CodeBlock from './CodeBlock.vue'

defineProps({
  example: { type: Object, required: true },
})

const showCode = ref(false)
</script>

<template>
  <section :id="example.id" class="demo" data-section>
    <h3 class="anchor-title">
      <a :href="`#${example.id}`">#</a>
      {{ example.title }}
    </h3>
    <p class="demo__desc" v-html="example.description" />
    <div class="demo__card">
      <div class="demo__preview">
        <component :is="example.component" />
      </div>
      <div class="demo__toolbar">
        <span class="demo__file">examples/{{ example.file }}</span>
        <button type="button" class="demo__toggle" :aria-expanded="showCode" @click="showCode = !showCode">
          {{ showCode ? 'Hide code' : 'Show code' }}
        </button>
      </div>
      <CodeBlock v-if="showCode" :code="example.source" />
    </div>
  </section>
</template>
