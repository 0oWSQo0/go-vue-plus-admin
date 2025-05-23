import type { App } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export const setupElementPlusIcons = (app: App<Element>) => {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
