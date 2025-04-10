import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout, getParentLayout } from '@/utils/routerHelper'
import { NO_RESET_WHITE_LIST } from '@/constants'

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Root',
    meta: {},
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home/index.vue'),
        meta: { title: '首页', icon: 'vi-ant-design:dashboard-filled' }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'RedirectWrap',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: { hidden: true, noTagsView: true }
  },
  // ry字典路由
  {
    path: '/system/dict-data',
    component: Layout,
    name: 'DictData',
    meta: { hidden: true },
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data.vue'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/loginLog',
    component: Layout,
    name: 'LoginLog',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/log/loginLog/index.vue'),
        name: 'LoginLogIndex',
        meta: { title: '登录日志', icon: 'vi-ant-design:login-outlined' }
      }
    ]
  },
  {
    path: '/operLog',
    component: Layout,
    name: 'operLog',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/log/operLog/index.vue'),
        name: 'operLogIndex',
        meta: { title: '操作日志', icon: 'vi-ant-design:login-outlined' }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login/index.vue'),
    name: 'Login',
    meta: { hidden: true, title: '登录', noTagsView: true }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: { hidden: true, title: '404', noTagsView: true }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = []

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !NO_RESET_WHITE_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
