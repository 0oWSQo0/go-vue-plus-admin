import { SUCCESS_CODE } from '@/constants'

const timeout = 1000


export default [
  // 字典接口
  {
    url: '/mock/system/config/configKey/sys.loginType',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        msg: 'default'
      }
    }
  },
]
