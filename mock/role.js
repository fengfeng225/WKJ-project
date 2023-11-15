const { getRoleList, getRoleRelation, getUserRelation, getMenuList, getButtons, getColumns } = require('./sqlDatabase')

module.exports = [
  // 授权
  {
    url: '/api/permission/role/Authorize',
    type: 'get',
    response: config => {
      const { roleId, type, menuIds } = config.query
      const roleRelation = getRoleRelation()
      let list, all, ids

      if (type === 'menu') {
        list = getMenuList()
        all = list.map(item => item.id)
        ids = roleRelation.filter(item => item.itemType === type && item.roleId === roleId).map(item => item.itemId)
      } else if (type === 'button') {
        if (menuIds === '') return
        const buttonList = getButtons().filter(item => menuIds.split(',').includes(item.moduleId))
        const menuList = getMenuList().filter(item => menuIds.split(',').includes(item.id))
        list = buttonList.concat(menuList)
        all = list.map(item => item.id)
        ids = roleRelation.filter(item => item.itemType === type && item.roleId === roleId).map(item => item.itemId)
      } else if (type === 'column') {
        if (menuIds === '') return
        const columnList = getColumns().filter(item => menuIds.split(',').includes(item.moduleId))
        const menuList = getMenuList().filter(item => menuIds.split(',').includes(item.id))
        list = columnList.concat(menuList)
        all = list.map(item => item.id)
        ids = roleRelation.filter(item => item.itemType === type && item.roleId === roleId).map(item => item.itemId)
      } else {
        return {
          code: 400,
          message: '参数错误'
        }
      }

      return {
        code: 200,
        data: {
          list,
          ids,
          all
        }
      }
    }
  },
  {
    url: '/api/permission/role/Authorize',
    type: 'put',
    response: config => {
      const { roleId, data } = config.body
      const roleRelation = getRoleRelation()
      const buttonListIds = getButtons().map(item => item.id)
      const columnListIds = getColumns().map(item => item.id)

      // 删除oldRoleRelation
      const oldRoleRelation = roleRelation.filter(item => item.roleId === roleId)
      roleRelation.splice(0, Infinity)

      // 新增
      const { menus, buttons, columns } = data
      const newMenus = menus.map(itemId => {
        return {
          id: Math.ceil(Math.random() * 10000000000),
          itemType: 'menu',
          itemId,
          roleId,
          creatorTime: Date.now()
        }
      })
      const newButtons = buttons.filter(id => buttonListIds.includes(id)).map(itemId => {
        return {
          id: Math.ceil(Math.random() * 10000000000),
          itemType: 'button',
          itemId,
          roleId,
          creatorTime: Date.now()
        }
      })
      const newColumns = columns.filter(id => columnListIds.includes(id)).map(itemId => {
        return {
          id: Math.ceil(Math.random() * 10000000000),
          itemType: 'column',
          itemId,
          roleId,
          creatorTime: Date.now()
        }
      })

      roleRelation.push(...newMenus, ...newButtons, ...newColumns)

      return {
        code: 200,
        message: '操作成功'
      }
    }
  },

  // 角色
  {
    url: '/api/permission/role/list',
    type: 'get',
    response: config => {
      const { keyword } = config.query
      const allRoles = getRoleList()

      // 查询code

      return {
        code: 200,
        data: {
          list: allRoles
        }
      }
    }
  },
  {
    url: '/api/permission/role',
    type: 'delete',
    response: config => {
      const { id } = config.body
      const allRoles = getRoleList()
      const currentRole = allRoles.findIndex(item => item.id === id)

      if (currentRole > -1) {
        allRoles.splice(currentRole, 1)
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
    url: '/api/permission/role',
    type: 'post',
    response: config => {
      const newRole = config.body
      const allRoles = getRoleList()

      // 查重

      newRole.id = Math.ceil(Math.random() * 100000000000)
      newRole.creatorTime = Date.now()
      allRoles.push(newRole)

      return {
        code: 200,
        message: '操作成功'
      }
    }
  },
  {
    url: '/api/permission/role',
    type: 'put',
    response: config => {
      const role = config.body
      const allRoles = getRoleList()
      const currentRole = allRoles.find(item => item.id === role.id)

      if (currentRole) {
        for (const key in currentRole) {
          currentRole[key] = role[key]
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
    url: '/api/permission/role/info',
    type: 'get',
    response: config => {
      const { id } = config.query
      const allRoles = getRoleList()
      const currentRole = allRoles.find(item => item.id === id)

      if (currentRole) {
        return {
          code: 200,
          data: currentRole
        }
      }

      return {
        code: 400,
        message: '没有找到资源'
      }
    }
  }
]
