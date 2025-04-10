import request from '@/axios'

export const listOperLogApi = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/monitor/operlog/list', params })
}