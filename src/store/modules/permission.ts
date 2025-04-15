import { defineStore } from 'pinia'
import { asyncRouterMap, constantRouterMap } from '@/router'
import { generateRoutesByServer, flatMultiLevelRoutes, handleGoRouters } from '@/utils/routerHelper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'
import { useAppStore } from './app'
import type { RouteRecordRaw } from 'vue-router'
import { getDynamicRouterApi } from '@/api/login'

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    async setRouters() {
      const { addRoute } = useRouter()
      const appStore = useAppStore()
      if (appStore.getDynamicRouter) {
        const res = await getDynamicRouterApi()
        const routers = res?.data?.list || []
        await this.generateRoutes('server', routers).catch(() => {})
      } else {
        await this.generateRoutes('static').catch(() => {})
      }
      this.setIsAddRouters(true)
      this.getAddRouters.forEach((route: RouteRecordRaw) => {
        addRoute(route) // 动态添加可访问路由表
      })
    },
    generateRoutes(type: 'server' | 'static', routers?: AppCustomRouteRecordRaw[] | string[]): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []
        if (type === 'server') {
          // 模拟后端过滤菜单
          const transRoutes = handleGoRouters(routers as AppCustomRouteRecordRaw[])
          routerMap = generateRoutesByServer(transRoutes as AppCustomRouteRecordRaw[])
        } else {
          // 直接读取静态路由表
          routerMap = cloneDeep(asyncRouterMap)
        }
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: { hidden: true, breadcrumb: false }
          }
        ])
        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  },
  persist: [
    {
      pick: ['routers'],
      storage: localStorage
    },
    {
      pick: ['addRouters'],
      storage: localStorage
    },
    {
      pick: ['menuTabRouters'],
      storage: localStorage
    }
  ]
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
