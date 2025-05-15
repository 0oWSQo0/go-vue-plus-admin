import request from '@/axios'

export const listDataApi = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/admin/dictData/list', params })
}

export const getDicts = (dictType: string): Promise<IResponse<any>> => {
  return request.get({ url: `/admin/dictData/option/${dictType}` })
}

export const updateDataApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/dictData/edit', data })
}

export const delDataApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: 'admin/dictData/delete', data })
}
