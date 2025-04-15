import request from '@/axios'

export const listRoleApi = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/admin/role/list', params })
}

export const updateRoleApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/role/edit', data })
}

export const delRoleApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: `/admin/role/delete`, data })
}

export const listDataScopeApi = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/admin/role/dataScope/select', params })
}

export const updateDataScopeApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/role/dataScope/edit', data })
}

export const listPermiApi = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/admin/role/getPermissions', params })
}

export const updatePermiApi = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/admin/role/updatePermissions', data })
}
