const { getUsers, getUserRelation, getRoleRelation, getMenuList, getButtons, getColumns } = require('./sqlDatabase')
const { getTreeData } = require('./utils')

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
          token: currentUser.id
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

      // 根据token获取当前用户
      // code 简写
      const userId = token

      const users = getUsers()
      const currentUser = users.find(item => item.id === userId)

      // mock error
      if (!currentUser) {
        return {
          code: 601,
          message: '登录失败，无法获取用户信息。'
        }
      }

      const menus = getMenuList()
      const buttons = getButtons()
      const columns = getColumns()

      const userInfo = currentUser
      let menuList, permissionList

      if (userId === 'admin') {
        menuList = getTreeData(menus, '-1')
        permissionList = menus.map(menu => {
          return {
            button: buttons.filter(button => button.moduleId === menu.id),
            column: columns.filter(column => column.moduleId === menu.id),
            menuId: menu.id,
            menuName: menu.fullName
          }
        })
        return {
          code: 200,
          data: {
            menuList,
            permissionList,
            userInfo
          }
        }
      }

      // 获取对应关系的中间表
      const userRelation = getUserRelation()
      const roleRelation = getRoleRelation()

      // 获取当前用户拥有的角色id
      const roleIds = userRelation.filter(item => item.userId === userId).map(item => item.roleId)
      // 获取角色所有的权限id
      const hasPermissionList = roleRelation.filter(item => roleIds.includes(item.roleId))

      // menu 必须处理成tree结构
      const menuIds = hasPermissionList.filter(item => item.itemType === 'menu').maps(item => item.itemId)
      const hasPermissionMenus = menus.filter(item => menuIds.includes(item.id))
      menuList = getTreeData(hasPermissionMenus, '-1')

      // permissionList

      // button 只需 entityCode fullName id
      const buttonIds = hasPermissionList.filter(item => item.itemType === 'button').maps(item => item.itemId)
      const buttonList = buttons.filter(item => buttonIds.includes(item.id))

      // column
      const columnIds = hasPermissionList.filter(item => item.itemType === 'column').maps(item => item.itemId)
      const columnList = columns.filter(item => columnIds.includes(item.id))

      permissionList = hasPermissionMenus.map(menu => {
        return {
          button: buttonList.filter(button => button.moduleId === menu.id),
          column: columnList.filter(column => column.moduleId === menu.id),
          menuId: menu.id,
          menuName: menu.fullName
        }
      })

      return {
        code: 200,
        data: {
          menuList,
          permissionList,
          userInfo
        }
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
