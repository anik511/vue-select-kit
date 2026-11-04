import type { App, Plugin } from 'vue'
import Select from './components/Select.vue'
import Option from './components/Option.vue'
import OptionGroup from './components/OptionGroup.vue'
import './styles/select.css'

export interface VueSelectKitOptions {
  /** Component name prefix. Default `Vs` → `<VsSelect>`, `<VsOption>`, `<VsOptionGroup>`. */
  prefix?: string
}

const VueSelectKit: Plugin<[VueSelectKitOptions?]> = {
  install(app: App, options: VueSelectKitOptions = {}) {
    const prefix = options.prefix ?? 'Vs'
    app.component(`${prefix}Select`, Select)
    app.component(`${prefix}Option`, Option)
    app.component(`${prefix}OptionGroup`, OptionGroup)
  },
}

export default VueSelectKit
export { Select as VsSelect, Option as VsOption, OptionGroup as VsOptionGroup }
export type * from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VsSelect: typeof Select
    VsOption: typeof Option
    VsOptionGroup: typeof OptionGroup
  }
}
