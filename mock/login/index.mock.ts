const getInfoData = {
  msg: '操作成功',
  code: 200,
  permissions: ['*:*:*'],
  roles: ['admin'],
  user: {
    createBy: 'admin',
    createTime: '2024-06-30 11:27:11',
    updateBy: null,
    updateTime: null,
    remark: '管理员',
    userId: 1,
    deptId: 103,
    userName: 'admin',
    nickName: '我是管理员',
    email: 'ry@163.com',
    phonenumber: '15888888888',
    sex: '1',
    avatar: '',
    password: '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2',
    status: '0',
    delFlag: '0',
    loginIp: '140.206.152.42',
    loginDate: '2025-03-24T17:48:25.000+08:00',
    dept: {
      createBy: null,
      createTime: null,
      updateBy: null,
      updateTime: null,
      remark: null,
      deptId: 103,
      parentId: 101,
      ancestors: '0,100,101',
      deptName: '研发部门',
      orderNum: 1,
      leader: '若依',
      phone: null,
      email: null,
      status: '0',
      delFlag: null,
      parentName: null,
      children: []
    },
    roles: [
      {
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        roleId: 1,
        roleName: '超级管理员',
        roleKey: 'admin',
        roleSort: 1,
        dataScope: '1',
        menuCheckStrictly: false,
        deptCheckStrictly: false,
        status: '0',
        delFlag: null,
        flag: false,
        menuIds: null,
        deptIds: null,
        permissions: null,
        admin: true
      }
    ],
    roleIds: null,
    postIds: null,
    roleId: null,
    admin: true
  }
}

const getRoutersData = {
  msg: '操作成功',
  code: 200,
  data: [
    {
      name: 'System',
      path: '/system',
      redirect: 'noRedirect',
      component: 'Layout',
      meta: { title: '系统管理', icon: 'vi-ri:function-fill' },
      children: [
        {
          name: 'User',
          path: 'user',
          component: 'system/user/index',
          meta: { title: '用户管理', icon: 'vi-ri:function-fill' }
        },
        {
          name: 'Role',
          path: 'role',
          component: 'system/role/index',
          meta: { title: '角色管理', icon: 'vi-ri:function-fill' }
        },
        {
          name: 'Menu',
          path: 'menu',
          component: 'system/menu/index',
          meta: { title: '菜单管理', icon: 'vi-ri:function-fill' }
        },
        {
          name: 'Dict',
          path: 'dict',
          component: 'system/dict/index',
          meta: { title: '字典管理', icon: 'vi-ri:function-fill' }
        },
        {
          name: 'Config',
          path: 'config',
          component: 'system/config/index',
          meta: { title: '参数设置', icon: 'vi-ri:function-fill' }
        }
      ]
    },
    {
      name: 'Log',
      path: '/log',
      redirect: '/log/operLog',
      component: 'Layout',
      meta: { title: '日志管理', icon: 'vi-ri:function-fill' },
      children: [
        {
          name: 'operLog',
          path: 'operLog',
          component: 'system/log/operLog/index',
          meta: { title: '操作日志', icon: 'vi-ri:function-fill' }
        },
        {
          name: 'loginLog',
          path: 'loginLog',
          component: 'system/log/loginLog/index',
          meta: { title: '登录日志', icon: 'vi-ri:function-fill' }
        }
      ]
    },
    {
      name: 'Resources',
      path: '/resources',
      component: 'Layout',
      redirect: '/resources/resourcesIndex',
      meta: {},
      children: [
        {
          name: 'ResourcesIndex',
          path: 'resourcesIndex',
          component: 'vpn/resources/index',
          meta: { title: '资源管理', icon: 'vi-ri:function-fill' }
        }
      ]
    },
    {
      name: 'RemoteUser',
      path: '/remoteUser',
      component: 'Layout',
      redirect: '/remoteUser/remoteUserIndex',
      meta: { title: '远程用户管理', icon: 'vi-ri:function-fill' },
      children: [
        {
          name: 'RemoteUserIndex',
          path: 'remoteUserIndex',
          component: 'vpn/remoteUser/index',
          meta: { title: '用户设置', icon: 'vi-ri:function-fill' }
        },
        {
          name: 'OnlineUser',
          path: 'onlineUser',
          component: 'vpn/onlineUser/index',
          meta: { title: '在线用户', icon: 'vi-ri:function-fill' }
        },
        {
          name: 'iptables',
          path: 'iptables',
          component: 'vpn/iptables/index',
          meta: { title: '虚IP分配表', icon: 'vi-ri:function-fill' }
        }
      ]
    },
    {
      name: 'UserGroup',
      path: '/userGroup',
      component: 'Layout',
      redirect: '/userGroup/userGroupIndex',
      meta: {},
      children: [
        {
          name: 'UserGroupIndex',
          path: 'userGroupIndex',
          component: 'vpn/userGroup/index',
          meta: { title: '用户组管理', icon: 'vi-ri:function-fill' }
        }
      ]
    },
    {
      name: 'Website',
      path: '/website',
      component: 'Layout',
      redirect: '/website/websiteIndex',
      meta: {},
      children: [
        {
          name: 'WebsiteIndex',
          path: 'websiteIndex',
          component: 'vpn/website/index',
          meta: { title: '默认门户设置', icon: 'vi-ri:function-fill' }
        }
      ]
    },
    {
      name: 'Routes',
      path: '/routes',
      component: 'Layout',
      redirect: '/routes/routesIndex',
      meta: {},
      children: [
        {
          name: 'RoutesIndex',
          path: 'routesIndex',
          component: 'vpn/routes/index',
          meta: { title: '智能选路', icon: 'vi-ri:function-fill' }
        }
      ]
    },
    {
      name: 'Sms',
      path: '/sms',
      component: 'Layout',
      redirect: '/sms/smsIndex',
      meta: {},
      children: [
        {
          name: 'SmsIndex',
          path: 'smsIndex',
          component: 'vpn/sms/index',
          meta: { title: '短信服务', icon: 'vi-ri:function-fill' }
        }
      ]
    },
    {
      name: 'Cards',
      path: '/cards',
      component: 'Layout',
      redirect: '/cards/cardService',
      meta: { title: '名片管理', icon: 'vi-ri:function-fill' },
      children: [
        {
          name: 'CardService',
          path: 'cardService',
          component: 'vpn/cardService/index',
          meta: { title: '名片服务器', icon: 'vi-ri:function-fill' }
        },
        {
          name: 'CardDept',
          path: 'cardDept',
          component: 'vpn/cardDept/index',
          meta: { title: '部门管理', icon: 'vi-ri:function-fill' }
        },
        {
          name: 'CardDeptGroup',
          path: 'cardDeptGroup',
          component: 'vpn/cardDeptGroup/index',
          meta: { title: '部门组管理', icon: 'vi-ri:function-fill' }
        },
        {
          name: 'Employee',
          path: 'employee',
          component: 'vpn/employee/index',
          meta: { title: '员工管理', icon: 'vi-ri:function-fill' }
        }
      ]
    },
    {
      name: 'Settings',
      path: '/settings',
      component: 'Layout',
      redirect: '/settings/tunnel',
      meta: { title: '参数设置', icon: 'vi-ri:function-fill' },
      children: [
        {
          name: 'Tunnel',
          path: 'tunnel',
          component: 'vpn/tunnel/index',
          meta: { title: '隧道参数', icon: 'vi-ri:function-fill' }
        },
        {
          name: 'Csp',
          path: 'csp',
          component: 'vpn/csp/index',
          meta: { title: 'CSP管理', icon: 'vi-ri:function-fill' }
        },
        {
          name: 'sso',
          path: 'sso',
          component: 'vpn/sso/index',
          meta: { title: 'CS单点登录', icon: 'vi-ri:function-fill' }
        }
      ]
    },
    {
      name: 'PointPolicy',
      path: '/pointPolicy',
      component: 'Layout',
      redirect: '/pointPolicy/pointPolicyIndex',
      meta: { title: '端点安全', icon: 'vi-ri:function-fill' },
      children: [
        {
          name: 'PointPolicyIndex',
          path: 'pointPolicyIndex',
          component: 'vpn/pointPolicy/index',
          meta: { title: '端点安全策略', icon: 'vi-ri:function-fill' }
        }
      ]
    }
  ]
}

export default [
  {
    url: '/mock/getInfo',
    response() {
      return getInfoData
    }
  },
  {
    url: '/mock/getRouters',
    response() {
      return getRoutersData
    }
  },
  {
    url: '/mock/login',
    response() {
      return {
        msg: '操作成功',
        code: 200,
        token:
          'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6Ijk1MmE4YTMyLWY3NzEtNDgwOS1hMzNkLWI0OWFhYWUxYWNkZiJ9.GgjdlUcSfptWXjQ9d1gW-HutcOFZ0RCMZ5L7asLlolViusAvk94g913x8hhWX6rZAW2N7shJWErQCK3anUjEgA'
      }
    }
  },
  {
    url: '/mock/captchaImage',
    response() {
      return {
        msg: '操作成功',
        code: 200,
        captchaEnabled: true,
        uuid: '123456789',
        img: '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'
      }
    }
  },
  {
    url: '/mock/logout',
    response() {
      return {
        msg: '操作成功',
        code: 200
      }
    }
  },
  {
    url: '/mock/security/randomString16',
    response() {
      return {
        msg: '操作成功',
        code: 200,
        data: '1234567890123456'
      }
    }
  }
]
