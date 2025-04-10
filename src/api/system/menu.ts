import request from '@/axios'

/**
 * ry-menu-api
 */
export const listMenu = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/system/menu/list', params })
}

export const getMenu = (id: string): Promise<IResponse<any>> => {
  return request.get({ url: `/system/menu/${id}` })
}

export const addMenu = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/system/menu', data })
}

export const updateMenu = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/menu', data })
}

export const delMenu = (id: string): Promise<IResponse<any>> => {
  return request.delete({ url: `/system/menu/${id}` })
}

export const treeselect = (): Promise<IResponse<any>> => {
  return request.get({ url: '/system/menu/treeselect' })
}

export const roleMenuTreeselect = (roleId: string): Promise<IResponse<any>> => {
  return request.get({ url: `/system/menu/roleMenuTreeselect/${roleId}` })
}
