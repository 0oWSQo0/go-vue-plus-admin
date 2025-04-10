import request from '@/axios'

export const listData = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/system/dict/data/list', params })
}

export const getData = (dictCode: string): Promise<IResponse<any>> => {
  return request.get({ url: `/system/dict/data/${dictCode}` })
}

export const getDicts = (dictType: string): Promise<IResponse<any>> => {
  return request.get({ url: `/system/dict/data/type/${dictType}` })
}

export const addData = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/system/dict/data', data })
}

export const updateData = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/dict/data', data })
}

export const delData = (dictCode: string): Promise<IResponse<any>> => {
  return request.delete({ url: `/system/dict/data/${dictCode}` })
}
