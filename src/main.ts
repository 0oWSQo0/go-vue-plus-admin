import 'vue/jsx'

// 引入windi css
import '@/plugins/unocss'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 引入状态管理
import { setupStore } from '@/store'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入elementplus图标
import { setupElementPlusIcons } from '@/plugins/elementPlus'

// 引入全局样式
import '@/styles/index.less'

// 引入动画
import '@/plugins/animate.css'

// 路由
import { setupRouter } from './router'

// 权限
import { setupPermission } from './directives'

// ryTools
import installRyPlugins from './plugins/ryTools'

import { createApp } from 'vue'
// 解决某些BUG，须手动导入
import { ElLoading } from 'element-plus'

import App from './App.vue'

import './permission'

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  app.use(ElLoading)

  setupStore(app)

  setupGlobCom(app)

  setupRouter(app)

  setupPermission(app)

  setupElementPlusIcons(app)

  installRyPlugins(app)

  app.mount('#app')
}

setupAll()
