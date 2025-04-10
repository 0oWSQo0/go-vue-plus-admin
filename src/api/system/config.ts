import request from '@/axios'

export const listConfig = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/system/config/list', params })
}

export const getConfig = (id: string): Promise<IResponse<any>> => {
  return request.get({ url: `/system/config/${id}` })
}

export const getConfigKey = (configKey: string): Promise<IResponse<any>> => {
  return request.get({ url: `/system/config/configKey/${configKey}` })
}

export const addConfig = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/system/config', data })
}

export const updateConfig = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/config', data })
}

export const delConfig = (id: string): Promise<IResponse<any>> => {
  return request.delete({ url: `/system/config/${id}` })
}

export const refreshCache = (): Promise<IResponse<any>> => {
  return request.put({ url: '/system/config/refreshCache' })
}
