import request from '@/axios'
import type { UserType, UserLoginType, CodeType } from './types'

interface RoleParams {
  roleName: string
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/mock/user/list', params })
}

export const getAdminRoleApi = (params: RoleParams): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/mock/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/mock/role/list2', params })
}

export const loginApi = (data: UserLoginType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/login', data, headers: { isToken: false } })
}

export const getCodeApi = (): Promise<IResponse & CodeType> => {
  return request.get({ url: '/captchaImage', headers: { isToken: false } })
}

export const getUserInfoApi = (): Promise<IResponse<any>> => {
  return request.get({ url: '/getInfo' })
}

export const getDynamicRouterApi = (): Promise<IResponse<any>> => {
  return request.get({ url: '/getRouters' })
}
export const loginOutApi = (): Promise<IResponse<any>> => {
  return request.post({ url: '/logout' })
}

export const randomStringApi = (params: any): Promise<IResponse<any>> => {
  return request.get({ url: '/security/randomString16', params, headers: { isToken: false } })
}
