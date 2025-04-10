import { SUCCESS_CODE } from '@/constants'
import Mock from 'mockjs'

export default [
  // 获取某个字典
  {
    url: '/mock/vpn/resources/list',
    response: () => {
      return {
        code: SUCCESS_CODE,
        rows: [
            {
                id: '@id',
            }
        ]
      }
    }
  }
]
