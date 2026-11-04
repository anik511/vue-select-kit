import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { VsOption, VsOptionGroup, VsSelect } from '../src'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', disabled: true },
  { value: 'grape', label: 'Grape' },
]

function mountSlot(props: Record<string, any> = {}, list = fruits) {
  return mount(VsSelect, {
    attachTo: document.body,
    props: { teleported: false, ...props },
    slots: {
      default: () => list.map((f) => h(VsOption, { key: f.value, value: f.value, label: f.label, disabled: f.disabled })),
    },
  })
}

const optionEls = (w: ReturnType<typeof mount>) => w.findAll('.vs-option')
const lastEmit = (w: ReturnType<typeof mount>, name: string) => {
  const events = w.emitted(name) as any[][] | undefined
  return events?.[events.length - 1]?.[0]
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('single select', () => {
  it('shows the selected label and emits v-model updates', async () => {
    const w = mountSlot({ modelValue: 'banana' })
    await nextTick()
    expect((w.find('input').element as HTMLInputElement).value).toBe('Banana')

    await w.trigger('click')
    expect(w.emitted('visible-change')?.[0]).toEqual([true])
    await optionEls(w)[0].trigger('click')
    expect(lastEmit(w, 'update:modelValue')).toBe('apple')
    expect(lastEmit(w, 'change')).toBe('apple')
  })

  it('ignores disabled options', async () => {
    const w = mountSlot()
    await w.trigger('click')
    await optionEls(w)[2].trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('clears the value', async () => {
    const w = mountSlot({ modelValue: 'apple', clearable: true })
    await w.trigger('mouseenter')
    await w.find('.vs-select__clear').trigger('click')
    expect(lastEmit(w, 'update:modelValue')).toBeUndefined()
    expect(w.emitted('clear')).toHaveLength(1)
  })

  it('does not open when disabled', async () => {
    const w = mountSlot({ disabled: true })
    await w.trigger('click')
    expect(w.emitted('visible-change')).toBeUndefined()
  })

  it('supports object values with valueKey', async () => {
    const items = [{ id: 1, name: 'One' }, { id: 2, name: 'Two' }]
    const w = mount(VsSelect, {
      props: { teleported: false, valueKey: 'id', modelValue: { id: 2, name: 'Two' } },
      slots: { default: () => items.map((i) => h(VsOption, { key: i.id, value: i, label: i.name })) },
    })
    await nextTick()
    expect((w.find('input').element as HTMLInputElement).value).toBe('Two')
    expect(w.findAll('.vs-option')[1].classes()).toContain('is-selected')
  })
})

describe('keyboard', () => {
  it('navigates with arrows, skipping disabled options, and selects with Enter', async () => {
    const w = mountSlot()
    const input = w.find('input')
    await input.trigger('keydown', { key: 'ArrowDown' }) // open
    await input.trigger('keydown', { key: 'ArrowDown' }) // apple
    await input.trigger('keydown', { key: 'ArrowDown' }) // banana
    await input.trigger('keydown', { key: 'ArrowDown' }) // grape (cherry disabled)
    expect(w.find('.vs-option.is-hovered').text()).toBe('Grape')
    expect(input.attributes('aria-activedescendant')).toBe(w.find('.vs-option.is-hovered').attributes('id'))
    await input.trigger('keydown', { key: 'Enter' })
    expect(lastEmit(w, 'update:modelValue')).toBe('grape')
  })

  it('closes on Escape', async () => {
    const w = mountSlot()
    const input = w.find('input')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Escape' })
    expect(w.emitted('visible-change')).toEqual([[true], [false]])
  })
})

describe('multiple', () => {
  it('toggles values and renders tags', async () => {
    const w = mountSlot({ multiple: true, modelValue: ['apple'] })
    await nextTick()
    expect(w.findAll('.vs-tag').map((t) => t.text())).toEqual(['Apple'])
    await w.trigger('click')
    await optionEls(w)[1].trigger('click')
    expect(lastEmit(w, 'update:modelValue')).toEqual(['apple', 'banana'])
    await w.setProps({ modelValue: ['apple', 'banana'] })
    await optionEls(w)[0].trigger('click')
    expect(lastEmit(w, 'update:modelValue')).toEqual(['banana'])
  })

  it('removes a tag', async () => {
    const w = mountSlot({ multiple: true, modelValue: ['apple', 'banana'] })
    await nextTick()
    await w.findAll('.vs-tag__close')[0].trigger('click')
    expect(lastEmit(w, 'update:modelValue')).toEqual(['banana'])
    expect(lastEmit(w, 'remove-tag')).toBe('apple')
  })

  it('removes the last tag with Backspace', async () => {
    const w = mountSlot({ multiple: true, filterable: true, modelValue: ['apple', 'banana'] })
    await w.find('input').trigger('keydown', { key: 'Backspace' })
    expect(lastEmit(w, 'update:modelValue')).toEqual(['apple'])
  })

  it('respects multipleLimit', async () => {
    const w = mountSlot({ multiple: true, multipleLimit: 1, modelValue: ['apple'] })
    await w.trigger('click')
    expect(optionEls(w)[1].classes()).toContain('is-disabled')
    await optionEls(w)[1].trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('collapses tags', async () => {
    const w = mountSlot({ multiple: true, collapseTags: true, collapseTagsTooltip: true, modelValue: ['apple', 'banana', 'grape'] })
    await nextTick()
    const tags = w.findAll('.vs-tag').map((t) => t.text())
    expect(tags).toEqual(['Apple', '+ 2'])
    await w.find('.vs-select__collapsed').trigger('mouseenter')
    expect(w.findAll('.vs-select__tooltip .vs-tag').map((t) => t.text())).toEqual(['Banana', 'Grape'])
  })
})

describe('filtering', () => {
  it('filters options locally', async () => {
    const w = mountSlot({ filterable: true })
    await w.find('input').setValue('an')
    expect(optionEls(w).map((o) => o.text())).toEqual(['Banana'])
    await w.find('input').setValue('zzz')
    expect(w.find('.vs-select-dropdown__empty').text()).toBe('No matching data')
  })

  it('uses filterMethod instead of built-in filtering', async () => {
    const filterMethod = vi.fn()
    const w = mountSlot({ filterable: true, filterMethod })
    await w.find('input').setValue('ap')
    expect(filterMethod).toHaveBeenCalledWith('ap')
    expect(optionEls(w)).toHaveLength(4)
  })

  it('debounces remote search', async () => {
    vi.useFakeTimers()
    const remoteMethod = vi.fn()
    const w = mountSlot({ filterable: true, remote: true, remoteMethod, remoteDelay: 200 }, [])
    await w.find('input').setValue('a')
    await w.find('input').setValue('ab')
    expect(remoteMethod).not.toHaveBeenCalled()
    vi.advanceTimersByTime(200)
    expect(remoteMethod).toHaveBeenCalledTimes(1)
    expect(remoteMethod).toHaveBeenCalledWith('ab')
    await w.setProps({ loading: true })
    expect(w.find('.vs-select-dropdown__empty').text()).toBe('Loading')
    vi.useRealTimers()
  })

  it('keeps the label of a remote selection after options change', async () => {
    const list = ref([{ value: 1, label: 'Remote One' }])
    const value = ref()
    const Wrapper = defineComponent(() => () =>
      h(
        VsSelect,
        {
          teleported: false,
          filterable: true,
          remote: true,
          remoteMethod: () => {},
          modelValue: value.value,
          'onUpdate:modelValue': (v: any) => (value.value = v),
        },
        () => list.value.map((i) => h(VsOption, { key: i.value, value: i.value, label: i.label })),
      ),
    )
    const w = mount(Wrapper)
    await w.find('.vs-select').trigger('click')
    await w.find('.vs-option').trigger('click')
    // a new remote result set that no longer contains the selected option
    list.value = [{ value: 2, label: 'Remote Two' }]
    await nextTick()
    expect(value.value).toBe(1)
    expect((w.find('input').element as HTMLInputElement).value).toBe('Remote One')
  })

  it('creates new options with allowCreate', async () => {
    const w = mountSlot({ filterable: true, allowCreate: true, multiple: true, modelValue: [] })
    await w.find('input').setValue('Mango')
    const created = w.find('.vs-option.is-created')
    expect(created.exists()).toBe(true)
    await created.trigger('click')
    expect(lastEmit(w, 'update:modelValue')).toEqual(['Mango'])
  })

  it('hovers the first match with defaultFirstOption', async () => {
    const w = mountSlot({ filterable: true, defaultFirstOption: true })
    await w.find('input').setValue('ap')
    await nextTick()
    await w.find('input').trigger('keydown', { key: 'Enter' })
    expect(lastEmit(w, 'update:modelValue')).toBe('apple')
  })
})

describe('groups and slots', () => {
  it('cascades group disabled and hides empty groups when filtering', async () => {
    const w = mount(VsSelect, {
      props: { teleported: false, filterable: true },
      slots: {
        default: () => [
          h(VsOptionGroup, { label: 'Fruits', disabled: true }, () => [h(VsOption, { value: 'apple', label: 'Apple' })]),
          h(VsOptionGroup, { label: 'Veg' }, () => [h(VsOption, { value: 'carrot', label: 'Carrot' })]),
        ],
      },
    })
    await w.trigger('click')
    expect(w.findAll('.vs-option')[0].classes()).toContain('is-disabled')
    await w.find('input').setValue('car')
    const groups = w.findAll('.vs-option-group')
    expect((groups[0].element as HTMLElement).style.display).toBe('none')
    expect((groups[1].element as HTMLElement).style.display).toBe('')
  })

  it('renders prefix, header, footer, empty and label slots', async () => {
    const w = mount(VsSelect, {
      props: { teleported: false, modelValue: 'x' },
      slots: {
        prefix: () => 'P',
        header: () => 'H',
        footer: () => 'F',
        empty: () => 'Nothing here',
        label: ({ value }: any) => `Value: ${value}`,
      },
    })
    expect(w.find('.vs-select__prefix').text()).toBe('P')
    expect(w.find('.vs-select-dropdown__header').text()).toBe('H')
    expect(w.find('.vs-select-dropdown__footer').text()).toBe('F')
    expect(w.find('.vs-select-dropdown__empty').text()).toBe('Nothing here')
    expect(w.find('.vs-select__label').text()).toBe('Value: x')
  })
})

describe('data-driven options', () => {
  it('renders options and groups with a props mapping', async () => {
    const w = mount(VsSelect, {
      props: {
        teleported: false,
        modelValue: 2,
        props: { label: 'name', value: 'id', options: 'children' },
        options: [
          { name: 'Group A', children: [{ id: 1, name: 'One' }, { id: 2, name: 'Two' }] },
          { id: 3, name: 'Three' },
        ],
      },
    })
    expect((w.find('input').element as HTMLInputElement).value).toBe('Two')
    expect(w.find('.vs-option-group__title').text()).toBe('Group A')
    expect(w.findAll('.vs-option').map((o) => o.text())).toEqual(['One', 'Two', 'Three'])
  })

  it('virtualizes large lists', async () => {
    const options = Array.from({ length: 10000 }, (_, i) => ({ value: i, label: `Item ${i}` }))
    const w = mount(VsSelect, {
      props: { teleported: false, virtual: true, options, height: 340, itemHeight: 34 },
    })
    await w.trigger('click')
    const rendered = w.findAll('.vs-option')
    expect(rendered.length).toBeGreaterThan(0)
    expect(rendered.length).toBeLessThan(30)
    await rendered[3].trigger('click')
    expect(lastEmit(w, 'update:modelValue')).toBe(3)
  })

  it('renders the option slot', async () => {
    const w = mount(VsSelect, {
      props: { teleported: false, options: fruits },
      slots: { option: ({ item }: any) => `★ ${item.label}` },
    })
    expect(w.findAll('.vs-option')[0].text()).toBe('★ Apple')
  })
})
