import { defineStore } from 'pinia'
import { store } from '../index'
import { UserLoginType, UserType } from '@/api/login/types'
import { ElMessageBox } from 'element-plus'
import { loginOutApi } from '@/api/login'
import { useTagsViewStore } from './tagsView'
import router from '@/router'
import { getConfigKey } from '@/api/system/config'
import { get } from 'http'

interface UserState {
  userInfo?: UserType
  token: string
  roleRouters?: string[] | AppCustomRouteRecordRaw[]
  rememberMe: boolean
  loginInfo?: UserLoginType
  loginType?: string
  ukeyInfo?: any
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      userInfo: undefined,
      token: '',
      roleRouters: undefined,
      // 记住我
      rememberMe: true,
      loginInfo: undefined,
      loginType: 'account',
      ukeyInfo: undefined
    }
  },
  getters: {
    getToken(): string {
      return this.token
    },
    getUserInfo(): UserType | undefined {
      return this.userInfo
    },
    getRoleRouters(): string[] | AppCustomRouteRecordRaw[] | undefined {
      return this.roleRouters
    },
    getRememberMe(): boolean {
      return this.rememberMe
    },
    getLoginInfo(): UserLoginType | undefined {
      return this.loginInfo
    },
    getLoginType(): string {
      return this.loginType
    },
    getUkeyInfo(): any {
      return this.ukeyInfo
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(userInfo?: UserType) {
      this.userInfo = userInfo
    },
    setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw[]) {
      this.roleRouters = roleRouters
    },
    async logoutConfirm() {
      await ElMessageBox.confirm('是否退出本系统？', '温馨提示', { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' })
      await loginOutApi().catch(() => {})
      this.reset()
    },
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setToken('')
      this.setUserInfo(undefined)
      // this.setRoleRouters([])
      router.replace('/login')
    },
    logout() {
      this.reset()
    },
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe
    },
    setLoginInfo(loginInfo: UserLoginType | undefined) {
      this.loginInfo = loginInfo
    },
    async setLoginType(loginType: string) {
      this.loginType = loginType
    },
    setUkeyInfo(ukeyInfo: any) {
      this.ukeyInfo = ukeyInfo
    }
  },
  persist: true
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
