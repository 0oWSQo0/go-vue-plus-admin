import request from '@/axios'

/**
 * go-menu-api
 */
export const listMenuApi = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/admin/menu/list', params })
}

export const updateMenuApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/menu/edit', data })
}

export const delMenuApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/menu/delete', data })
}
