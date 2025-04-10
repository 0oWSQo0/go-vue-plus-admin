import Mock from 'mockjs'
import { SUCCESS_CODE } from '@/constants'


const roleList = {
  "total": 2,
  "rows": [
      {
          "createBy": null,
          "createTime": "2024-06-30 11:27:15",
          "updateBy": null,
          "updateTime": null,
          "remark": "超级管理员",
          "roleId": 1,
          "roleName": "超级管理员",
          "roleKey": "admin",
          "roleSort": 1,
          "dataScope": "1",
          "menuCheckStrictly": true,
          "deptCheckStrictly": true,
          "status": "0",
          "delFlag": "0",
          "flag": false,
          "menuIds": null,
          "deptIds": null,
          "permissions": null,
          "admin": true
      },
      {
          "createBy": null,
          "createTime": "2024-06-30 11:27:15",
          "updateBy": null,
          "updateTime": null,
          "remark": "普通角色",
          "roleId": 2,
          "roleName": "普通角色",
          "roleKey": "common",
          "roleSort": 2,
          "dataScope": "2",
          "menuCheckStrictly": true,
          "deptCheckStrictly": true,
          "status": "0",
          "delFlag": "0",
          "flag": false,
          "menuIds": null,
          "deptIds": null,
          "permissions": null,
          "admin": false
      }
  ],
  "code": 200,
  "msg": "查询成功"
}



export default [
  // 列表接口
  {
    url: '/mock/system/role/list',
    response: () => {
      return roleList
    }
  }
]
