import request from '@/axios'

export const listCertApi = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/secure/cert/list', params })
}

export const delCertApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: `/secure/cert/del`, data })
}