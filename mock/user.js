const { getUsers } = require('./sqlDatabase')

module.exports = [
  // user login
  {
    url: '/api/user/login',
    type: 'post',
    response: config => {
      const { username, password } = config.body
      const users = getUsers()
      const currentUser = users.find(item => item.account === username)

      // mock error
      if (!currentUser || currentUser.password !== password) {
        return {
          code: 600,
          message: '用户名或密码不正确。'
        }
      }

      return {
        code: 200,
        data: {
          token: currentUser.token
        }
      }
    }
  },

  // get user info
  {
    url: '/api/user/info\.*',
    type: 'get',
    response: config => {
      const token = config.headers.authorization
      const users = getUsers()
      const userInfo = users.find(item => item.token === token)

      // mock error
      if (!userInfo) {
        return {
          code: 601,
          message: '登录失败，无法获取用户信息。'
        }
      }

      return {
        code: 200,
        data: userInfo
      }
    }
  },

  // user logout
  {
    url: '/api/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },

  // 权限 用户管理
  {
    url: '/api/permission/user/resetPassword',
    type: 'put',
    response: config => {
      const { id, userPassword } = config.body
      const users = getUsers()

      const currentUser = users.find(item => item.id === id)

      if (currentUser) {
        currentUser.password = userPassword
        return {
          code: 200,
          message: '操作成功'
        }
      }

      return {
        code: 400,
        message: '用户不存在'
      }
    }
  },
  {
    url: '/api/permission/user/list',
    type: 'get',
    response: config => {
      const { keyword, currentPage = 1, pageSize = 20 } = config.query
      const users = getUsers()

      // 查询

      return {
        code: 200,
        data: {
          pagination: {
            pageIndex: 1,
            pageSize: 20,
            total: 2
          },
          list: users
        }
      }
    }
  },
  {
    url: '/api/permission/user',
    type: 'delete',
    response: config => {
      const { id } = config.body
      const users = getUsers()

      const currentUser = users.findIndex(item => item.id === id)

      if (currentUser > -1) {
        users.splice(currentUser, 1)
        return {
          code: 200,
          message: '操作成功'
        }
      }

      return {
        code: 400,
        message: '没有找到资源'
      }
    }
  },
  {
    url: '/api/permission/user',
    type: 'post',
    response: config => {
      const newUser = config.body
      const users = getUsers()

      // 查重

      newUser.id = Math.ceil(Math.random() * 100000000000)
      users.push(newUser)

      return {
        code: 200,
        message: '操作成功'
      }
    }
  },
  {
    url: '/api/permission/user',
    type: 'put',
    response: config => {
      const user = config.body
      const users = getUsers()

      const currentUser = users.find(item => item.id === user.id)

      if (currentUser) {
        for (const key in currentUser) {
          currentUser[key] = user[key]
        }
        return {
          code: 200,
          message: '操作成功'
        }
      }

      return {
        code: 400,
        message: '没有找到资源'
      }
    }
  },
  {
    url: '/api/permission/user/info',
    type: 'get',
    response: config => {
      const { id } = config.query
      const users = getUsers()

      const currentUser = users.find(item => item.id === id)

      if (currentUser) {
        return {
          code: 200,
          data: currentUser
        }
      }

      return {
        code: 400,
        message: '没有找到资源'
      }
    }
  }
]
