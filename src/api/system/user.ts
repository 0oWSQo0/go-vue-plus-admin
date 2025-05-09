import request from '@/axios'

export const listUserApi = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/admin/member/list', params })
}

export const updateUserApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/member/edit', data })
}

export const delUserApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: `/admin/member/delete`, data })
}

export const changeStatusApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: 'admin/member/status', data })
}

export const bindKeyApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/member/bindUKey', data })
}

export const unbindKeyApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/member/unBindUKey', data })
}
