import request from '@/axios'

export const listUserApi = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/admin/member/list', params })
}

export const getUserApi = (id: number | string): Promise<IResponse<any>> => {
  return request.get({ url: `/system/user/${id}` })
}

export const addUserApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/system/user', data })
}

export const updateUserApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/member/edit', data })
}

export const delUserApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: `/admin/member/delete`, data })
}

export const resetPwdApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/member/resetPwd', data })
}

export const updatePwdApi = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/user/profile/updatePwd', params: data })
}

export const changeStatusApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: 'admin/member/status', data })
}

export const bindKeyApi = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/user/bindUkey', data })
}

export const unbindKeyApi = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/user/unbindUkey', data })
}
