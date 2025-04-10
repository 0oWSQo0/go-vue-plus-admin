import type { App } from 'vue'
import { Icon } from './Icon'
import { Permission } from './Permission'
import RightToolbar from './RightToolbar/index.vue'
import Pagination from './Pagination/index.vue'
import DictTag from './DictTag/index.vue'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Icon', Icon)
  app.component('Permission', Permission)
  app.component('RightToolbar', RightToolbar)
  app.component('Pagination', Pagination)
  app.component('DictTag', DictTag)
}
