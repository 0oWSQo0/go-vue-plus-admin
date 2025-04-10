import request from '@/axios'

export const listRole = (params?: any): Promise<IResponse<any>> => {
  return request.get({ url: '/system/role/list', params })
}

export const getRole = (id: number): Promise<IResponse<any>> => {
  return request.get({ url: `/system/role/${id}` })
}

export const addRole = (data: any): Promise<IResponse<any>> => {
  return request.post({ url: '/system/role', data })
}

export const updateRole = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/role', data })
}

export const delRole = (id: number): Promise<IResponse<any>> => {
  return request.delete({ url: `/system/role/${id}` })
}

export const dataScope = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/role/dataScope', data })
}

export const changeRoleStatus = (data: any): Promise<IResponse<any>> => {
  return request.put({ url: '/system/role/changeStatus', data })
}

export const deptTreeSelect = (id: number): Promise<IResponse<any>> => {
  return request.get({ url: `/system/role/deptTree/${id}` })
}
