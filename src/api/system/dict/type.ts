import request from '@/axios'

export const listTypeApi = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/admin/dictType/tree', params })
}

export const updateTypeApi = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/dict/type', data })
}

export const delType = (id: string): Promise<IResponse<any>> => {
  return request.delete({ url: `/system/dict/type/${id}` })
}
