import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VueSelectKit from '../src'
import App from '../playground/App.vue'
import { examples } from '../playground/examples'
import { apiStyle } from '../playground/apiStyle.js'

let warnings: string[] = []
const origWarn = console.warn
const origError = console.error

beforeEach(() => {
  warnings = []
  console.warn = (...args: any[]) => warnings.push(String(args[0]))
  console.error = (...args: any[]) => warnings.push(String(args[0]))
})
afterEach(() => {
  console.warn = origWarn
  console.error = origError
  document.body.innerHTML = ''
})

const plugins = [VueSelectKit]

describe('documentation examples', () => {
  for (const example of examples) {
    it(`${example.title}: Composition and Options versions render the same`, async () => {
      const html: string[] = []
      for (const style of ['composition', 'options'] as const) {
        const variant = example[style]
        expect(variant.component, `${variant.file} missing`).toBeTruthy()
        expect(variant.source).toContain(style === 'options' ? 'export default' : '<script setup>')
        const w = mount(variant.component, { attachTo: document.body, global: { plugins } })
        await nextTick()
        await nextTick()
        // ignore generated ids and per-file scoped-style hashes
        html.push(w.html().replace(/vs-select-[a-z0-9]+/g, 'ID').replace(/ data-v-[a-f0-9]+=""/g, ''))
        w.unmount()
      }
      expect(html[1]).toBe(html[0])
      expect(warnings).toEqual([])
    })
  }
})

describe('documentation page', () => {
  it('renders in both API styles with every menu link resolving', async () => {
    window.scrollTo = () => {}
    const w = mount(App, { attachTo: document.body, global: { plugins } })
    for (const style of ['composition', 'options'] as const) {
      apiStyle.value = style
      await nextTick()
      const ids = new Set([...document.querySelectorAll('[data-section]')].map((s) => s.id))
      const links = w.findAll('.nav-group__items a').map((a) => a.attributes('href')!.slice(1))
      expect(links.filter((id) => !ids.has(id))).toEqual([])
      const quickStart = w.find('#quick-start .code-block code').text()
      expect(quickStart).toContain(style === 'options' ? 'export default' : '<script setup>')
    }
    expect(warnings).toEqual([])
  })
})
