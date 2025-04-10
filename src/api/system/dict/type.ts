import request from '@/axios'

export const listType = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/system/dict/type/list', params })
}

export const getType = (id: string): Promise<IResponse<any>> => {
  return request.get({ url: `/system/dict/type/${id}` })
}

export const addType = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/system/dict/type', data })
}

export const updateType = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/dict/type', data })
}

export const delType = (id: string): Promise<IResponse<any>> => {
  return request.delete({ url: `/system/dict/type/${id}` })
}

export const refreshCache = (): Promise<IResponse<any>> => {
  return request.delete({ url: '/system/dict/type/refreshCache' })
}

export const getDictOptionselect = (): Promise<IResponse<any>> => {
  return request.get({ url: '/system/dict/type/optionselect' })
}
