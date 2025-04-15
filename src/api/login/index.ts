import request from '@/axios'
import type { UserType, UserLoginType, CodeType } from './types'

export const loginApi = (data: UserLoginType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/admin/site/accountLogin', data, headers: { isToken: false } })
}

export const getCodeApi = (): Promise<IResponse & CodeType> => {
  return request.get({ url: '/admin/site/captcha', headers: { isToken: false } })
}

export const getUserInfoApi = (): Promise<IResponse<any>> => {
  return request.get({ url: '/admin/member/info' })
}

export const getDynamicRouterApi = (): Promise<IResponse<any>> => {
  return request.get({ url: '/admin/role/dynamic' })
}
export const loginOutApi = (): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/site/logout' })
}

export const randomStringApi = (params: any): Promise<IResponse<any>> => {
  return request.get({ url: '/security/randomString16', params, headers: { isToken: false } })
}
