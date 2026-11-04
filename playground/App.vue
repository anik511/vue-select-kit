<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import DemoBlock from './components/DemoBlock.vue'
import CodeBlock from './components/CodeBlock.vue'
import ApiTable from './components/ApiTable.vue'
import { examples } from './examples'
import * as api from './api.js'
import * as code from './snippets.js'

const menu = [
  {
    title: 'Guide',
    items: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'installation', label: 'Installation' },
      { id: 'quick-start', label: 'Quick start' },
      { id: 'typescript', label: 'TypeScript & JavaScript' },
    ],
  },
  { title: 'Examples', items: examples.map((e) => ({ id: e.id, label: e.title })) },
  {
    title: 'API',
    items: [
      { id: 'api-select-props', label: 'Select attributes' },
      { id: 'api-select-events', label: 'Select events' },
      { id: 'api-select-slots', label: 'Select slots' },
      { id: 'api-select-exposes', label: 'Select exposes' },
      { id: 'api-option', label: 'Option' },
      { id: 'api-option-group', label: 'OptionGroup' },
      { id: 'api-types', label: 'Types' },
    ],
  },
  {
    title: 'More',
    items: [
      { id: 'keyboard', label: 'Keyboard' },
      { id: 'theming', label: 'Theming' },
      { id: 'limitations', label: 'Notes & limitations' },
    ],
  },
]

const open = reactive(Object.fromEntries(menu.map((g) => [g.title, true])))
const activeId = ref(menu[0].items[0].id)
const sidebarOpen = ref(false)
const search = ref('')

const filteredMenu = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return menu
  return menu
    .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) }))
    .filter((g) => g.items.length)
})

function go(id) {
  sidebarOpen.value = false
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
  activeId.value = id
}

// scroll spy: the active section is the last one whose top has passed the header
let frame = 0
function onScroll() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const sections = document.querySelectorAll('[data-section]')
    let current = sections[0]?.id
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= 90) current = s.id
      else break
    }
    if (current) activeId.value = current
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  const hash = decodeURIComponent(location.hash.slice(1))
  if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView())
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const features = [
  'Single & multiple selection with tags',
  'Clearable, disabled, three sizes',
  'Local filtering, custom filter method, remote search',
  'Create options on the fly',
  'Option groups & custom option templates',
  'Prefix, label, tag, header, footer, empty and loading slots',
  'Data-driven options with field mapping',
  'Virtual scrolling for 10,000+ options',
  'Keyboard navigation & ARIA combobox roles',
  'Theming with CSS variables',
  'Works in JavaScript and TypeScript projects',
]
</script>

<template>
  <header class="topbar">
    <button type="button" class="topbar__menu" aria-label="Toggle menu" @click="sidebarOpen = !sidebarOpen">☰</button>
    <a href="#introduction" class="topbar__brand" @click.prevent="go('introduction')">
      <span class="topbar__logo">▾</span> vue-select-kit
    </a>
    <span class="topbar__version">v0.1.0</span>
  </header>

  <div class="layout">
    <aside class="sidebar" :class="{ 'is-open': sidebarOpen }">
      <input v-model="search" class="sidebar__search" type="search" placeholder="Search docs…" aria-label="Search docs" />
      <nav>
        <div v-for="group in filteredMenu" :key="group.title" class="nav-group">
          <button
            type="button"
            class="nav-group__title"
            :aria-expanded="open[group.title] || !!search"
            @click="open[group.title] = !open[group.title]"
          >
            {{ group.title }}
            <span class="nav-group__chevron" :class="{ 'is-open': open[group.title] || search }">›</span>
          </button>
          <ul v-show="open[group.title] || search" class="nav-group__items">
            <li v-for="item in group.items" :key="item.id">
              <a :href="`#${item.id}`" :class="{ 'is-active': activeId === item.id }" @click.prevent="go(item.id)">
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
    <div v-if="sidebarOpen" class="backdrop" @click="sidebarOpen = false" />

    <main class="content">
      <!-- ================= GUIDE ================= -->
      <section id="introduction" data-section>
        <h1>vue-select-kit</h1>
        <p class="lead">
          A select component for Vue 3: single and multiple selection, filtering, remote search,
          groups, option creation and virtual scrolling. Its API will feel familiar if you have used el-select.
        </p>
        <ul class="features">
          <li v-for="f in features" :key="f">{{ f }}</li>
        </ul>
      </section>

      <section id="installation" data-section>
        <h2>Installation</h2>
        <p>Requires <code>vue</code> 3.3 or newer. There are no other dependencies.</p>
        <CodeBlock :code="code.install" lang="bash" />

        <h3>Register globally</h3>
        <CodeBlock :code="code.registerGlobal" lang="js" />
        <CodeBlock :code="code.registerPrefix" lang="js" />

        <h3>Import per component</h3>
        <p>Skip <code>app.use()</code> and import only what a component needs:</p>
        <CodeBlock :code="code.registerLocal" />

        <h3>Without a build step (UMD)</h3>
        <p>The UMD build exposes a global <code>VueSelectKit</code>; the plugin is <code>VueSelectKit.default</code>.</p>
        <CodeBlock :code="code.umd" lang="html" />
      </section>

      <section id="quick-start" data-section>
        <h2>Quick start</h2>
        <CodeBlock :code="code.quickStart" />
        <p>See the <a href="#example-basic" @click.prevent="go('example-basic')">examples</a> below for every feature.</p>
      </section>

      <section id="typescript" data-section>
        <h2>TypeScript &amp; JavaScript</h2>
        <p>
          The package is written in TypeScript and ships compiled JavaScript (ES module and UMD) plus
          <code>.d.ts</code> declarations:
        </p>
        <ul>
          <li><b>JavaScript projects</b> use it like any other library. No TypeScript setup is needed.</li>
          <li>
            <b>TypeScript projects</b> get typed props, events and slots. Global components are typed through
            Vue's <code>GlobalComponents</code>, so <code>vue-tsc</code> and Volar check
            <code>&lt;VsSelect&gt;</code> in your templates.
          </li>
        </ul>
        <CodeBlock :code="code.typescript" />
        <p>
          Exported types: <code>SelectProps</code>, <code>OptionProps</code>, <code>OptionGroupProps</code>,
          <code>OptionData</code>, <code>OptionPropsMapping</code>, <code>SelectSize</code>, <code>Placement</code>.
        </p>
      </section>

      <!-- ================= EXAMPLES ================= -->
      <h2 class="part-title">Examples</h2>
      <DemoBlock v-for="example in examples" :key="example.id" :example="example" />

      <!-- ================= API ================= -->
      <h2 class="part-title">API</h2>

      <section id="api-select-props" data-section>
        <h3>Select attributes</h3>
        <ApiTable :columns="['Name', 'Description', 'Type', 'Default']" :rows="api.selectProps" :code-columns="[0, 2, 3]" />
      </section>

      <section id="api-select-events" data-section>
        <h3>Select events</h3>
        <ApiTable :columns="['Name', 'Description', 'Arguments']" :rows="api.selectEvents" :code-columns="[0, 2]" />
      </section>

      <section id="api-select-slots" data-section>
        <h3>Select slots</h3>
        <ApiTable :columns="['Name', 'Description', 'Scope']" :rows="api.selectSlots" :code-columns="[0, 2]" />
      </section>

      <section id="api-select-exposes" data-section>
        <h3>Select exposes</h3>
        <ApiTable :columns="['Name', 'Description', 'Type']" :rows="api.selectExposes" :code-columns="[0, 2]" />
      </section>

      <section id="api-option" data-section>
        <h3>Option attributes</h3>
        <ApiTable :columns="['Name', 'Description', 'Type', 'Default']" :rows="api.optionProps" :code-columns="[0, 2, 3]" />
        <h4>Option slots</h4>
        <ApiTable :columns="['Name', 'Description', 'Scope']" :rows="api.optionSlots" :code-columns="[0, 2]" />
      </section>

      <section id="api-option-group" data-section>
        <h3>OptionGroup attributes</h3>
        <ApiTable :columns="['Name', 'Description', 'Type', 'Default']" :rows="api.groupProps" :code-columns="[0, 2, 3]" />
        <h4>OptionGroup slots</h4>
        <ApiTable :columns="['Name', 'Description', 'Scope']" :rows="api.groupSlots" :code-columns="[0, 2]" />
      </section>

      <section id="api-types" data-section>
        <h3>Types</h3>
        <p><code>OptionData</code> is what the <code>tag</code> and <code>option</code> slots receive:</p>
        <CodeBlock :code="code.optionDataType" lang="ts" />
      </section>

      <!-- ================= MORE ================= -->
      <section id="keyboard" data-section>
        <h2>Keyboard</h2>
        <ApiTable :columns="['Key', 'Action']" :rows="api.keyboard" />
        <p>
          The input has <code>role="combobox"</code> with <code>aria-expanded</code> and
          <code>aria-activedescendant</code>. Options have <code>role="option"</code> and <code>aria-selected</code>.
        </p>
      </section>

      <section id="theming" data-section>
        <h2>Theming</h2>
        <p>Every color and size is a CSS variable. Override them globally or on one select:</p>
        <CodeBlock :code="code.theming" lang="css" />
        <ApiTable :columns="['Variable', 'Used for', 'Default']" :rows="api.cssVars" :code-columns="[0, 2]" />
      </section>

      <section id="limitations" data-section>
        <h2>Notes &amp; limitations</h2>
        <ul>
          <li>
            Virtual scrolling only works with the <code>options</code> prop. Options written as
            <code>&lt;VsOption&gt;</code> children are always rendered in full.
          </li>
          <li>
            Clicking inside the dropdown keeps focus on the select's input, so a text field placed in the
            <code>header</code> or <code>footer</code> slot can't be focused by clicking it.
          </li>
          <li>Option values must be unique (by <code>value-key</code> for objects).</li>
          <li>Clearing sets the value to <code>undefined</code> (single) or <code>[]</code> (multiple).</li>
        </ul>
      </section>

      <footer class="page-footer">vue-select-kit · MIT</footer>
    </main>
  </div>
</template>
