import request from '@/axios'

export const addCaCertApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/caCert', data })
}

export const listCertApi = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/admin/cert/List', params })
}

export const delCertApi = (id: number): Promise<IResponse<any>> => {
  return request.delete({ url: `/admin/cert/${id}` })
}
