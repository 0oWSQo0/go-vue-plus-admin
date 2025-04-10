import request from '@/axios'

export const listLoginLogApi = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/monitor/logininfor/list', params })
}