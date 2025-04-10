import { AxiosResponse, InternalAxiosRequestConfig } from './types'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { SUCCESS_CODE, TOKEN_KEY, TOKEN_PREFIX, TRANSFORM_REQUEST_DATA } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'
import { objToFormData } from '@/utils'
import { tansParams } from '@/utils/ryUtils'

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  const userStore = useUserStoreWithOut()
  if (config?.headers?.isToken !== false && userStore.getToken) {
    config.headers[TOKEN_KEY] = TOKEN_PREFIX + userStore.getToken
  }
  if (config.method === 'post' && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    config.data = qs.stringify(config.data)
  } else if (TRANSFORM_REQUEST_DATA && config.method === 'post' && config.headers['Content-Type'] === 'multipart/form-data' && !(config.data instanceof FormData)) {
    config.data = objToFormData(config.data)
  }
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  }
  return config
}

const defaultResponseInterceptors = (response: AxiosResponse) => {
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  } else if (response.data.code === SUCCESS_CODE) {
    return response.data
  } else if (response?.data?.code === 401) {
    ElMessage.error('登录已过期，请重新登录')
    const userStore = useUserStoreWithOut()
    userStore.logout()
    return Promise.reject(response)
  } else {
    ElMessage.error(response?.data?.msg || response?.data?.message)
    return Promise.reject(response)
  }
}

export { defaultResponseInterceptors, defaultRequestInterceptors }
