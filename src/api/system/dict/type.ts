import request from '@/axios'

export const listTypeApi = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/admin/dictType/tree', params })
}

export const updateTypeApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/dictType/edit', data })
}

export const delTypeApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/dictType/delete', data })
}
