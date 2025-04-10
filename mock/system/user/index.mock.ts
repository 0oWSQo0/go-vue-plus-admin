import { SUCCESS_CODE } from '@/constants'

const timeout = 1000

const userList = {
  "total": 2,
  "rows": [
      {
          "createBy": "admin",
          "createTime": "2024-06-30 11:27:11",
          "updateBy": null,
          "updateTime": null,
          "remark": "管理员",
          "userId": 1,
          "deptId": 103,
          "userName": "admin",
          "nickName": "若依",
          "email": "ry@163.com",
          "phonenumber": "15888888888",
          "sex": "1",
          "avatar": "",
          "password": null,
          "status": "0",
          "delFlag": "0",
          "loginIp": "111.53.130.195",
          "loginDate": "2025-03-25T09:40:51.000+08:00",
          "dept": {
              "createBy": null,
              "createTime": null,
              "updateBy": null,
              "updateTime": null,
              "remark": null,
              "deptId": 103,
              "parentId": null,
              "ancestors": null,
              "deptName": "研发部门",
              "orderNum": null,
              "leader": "若依",
              "phone": null,
              "email": null,
              "status": null,
              "delFlag": null,
              "parentName": null,
              "children": []
          },
          "roles": [],
          "roleIds": null,
          "postIds": null,
          "roleId": null,
          "admin": true
      },
      {
          "createBy": "admin",
          "createTime": "2024-06-30 11:27:11",
          "updateBy": null,
          "updateTime": null,
          "remark": "测试员",
          "userId": 2,
          "deptId": 105,
          "userName": "ry",
          "nickName": "若依",
          "email": "ry@qq.com",
          "phonenumber": "15666666666",
          "sex": "1",
          "avatar": "",
          "password": null,
          "status": "0",
          "delFlag": "0",
          "loginIp": "61.52.13.86",
          "loginDate": "2025-03-25T09:01:49.000+08:00",
          "dept": {
              "createBy": null,
              "createTime": null,
              "updateBy": null,
              "updateTime": null,
              "remark": null,
              "deptId": 105,
              "parentId": null,
              "ancestors": null,
              "deptName": "测试部门",
              "orderNum": null,
              "leader": "若依",
              "phone": null,
              "email": null,
              "status": null,
              "delFlag": null,
              "parentName": null,
              "children": []
          },
          "roles": [],
          "roleIds": null,
          "postIds": null,
          "roleId": null,
          "admin": false
      }
  ],
  "code": 200,
  "msg": "查询成功"
}

export default [
  {
    url: '/mock/system/user/list',
    method: 'get',
    response: () => {
      return userList
    }
  }
]
