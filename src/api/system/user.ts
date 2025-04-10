import request from '@/axios'

export const listUser = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/system/user/list', params })
}

export const getUser = (id: number | string): Promise<IResponse<any>> => {
  return request.get({ url: `/system/user/${id}` })
}

export const addUser = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/system/user', data })
}

export const updateUser = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/user', data })
}

export const delUser = (id: number | string): Promise<IResponse<any>> => {
  return request.delete({ url: `/system/user/${id}` })
}

export const resetUserPwd = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/user/resetPwd', data })
}

export const updateUserPwdApi = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/user/profile/updatePwd', params: data })
}

export const changeUserStatus = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/user/changeStatus', data })
}
