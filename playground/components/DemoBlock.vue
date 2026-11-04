<script setup>
import { computed, ref } from 'vue'
import { apiStyle } from '../apiStyle.js'
import ApiSwitch from './ApiSwitch.vue'
import CodeBlock from './CodeBlock.vue'

const props = defineProps({
  example: { type: Object, required: true },
})

const showCode = ref(false)
// the live demo runs the same file whose code is shown
const variant = computed(() => props.example[apiStyle.value])
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
        <component :is="variant.component" :key="apiStyle" />
      </div>
      <div class="demo__toolbar">
        <ApiSwitch small />
        <span class="demo__file">{{ variant.file }}</span>
        <button type="button" class="demo__toggle" :aria-expanded="showCode" @click="showCode = !showCode">
          {{ showCode ? 'Hide code' : 'Show code' }}
        </button>
      </div>
      <CodeBlock v-if="showCode" :code="variant.source" />
    </div>
  </section>
</template>
