import { SUCCESS_CODE } from '@/constants'

export default [
  {
    url: '/mock/admin/dictData/option/sys_normal_disable',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { value: 1, label: '正常', listClass: 'success' },
          { value: 2, label: '停用', listClass: 'danger' }
        ]
      }
    }
  },
  {
    url: '/mock/admin/dictData/option/cert_request_type',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { label: '纯净PQC证书', value: 1 },
          { label: '串联混合型证书', value: 2 }
        ]
      }
    }
  },
  {
    url: '/mock/admin/dictData/option/cert_type',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { label: '根CA证书', value: 1 },
          { label: '运营CA证书', value: 2 },
          { label: '用户证书', value: 3 }
        ]
      }
    }
  },
  {
    url: '/mock/admin/dictData/option/cert_version_type',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { label: 'V1', value: 0 },
          { label: 'V2', value: 1 },
          { label: 'V3', value: 2 }
        ]
      }
    }
  },
  {
    url: '/mock/admin/dictData/option/cert_level_type',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { label: '低', value: 0 },
          { label: '中', value: 1 },
          { label: '高', value: 2 }
        ]
      }
    }
  },
  {
    url: '/mock/admin/dictData/option/key_type',
    method: 'get',
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: [
          { label: '设备加密密钥', value: 0 },
          { label: '密钥加密密钥', value: 1 },
          { label: 'PQC签名密钥', value: 2 },
          { label: 'PQC加密密钥', value: 3 }
        ]
      }
    }
  }
]
