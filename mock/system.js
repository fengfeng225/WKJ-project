const { getMenuList, getButtons, getColumns } = require('./sqlDatabase')

module.exports = [
  // buttons
  {
    url: '/api/system/menu/button/list',
    type: 'get',
    response: config => {
      const { moduleId } = config.query
      const allButtons = getButtons()

      const moduleButtons = allButtons.filter(item => item.moduleId === moduleId)

      return {
        code: 200,
        data: {
          list: moduleButtons
        }
      }
    }
  },
  {
    url: '/api/system/menu/button',
    type: 'delete',
    response: config => {
      const { id } = config.body
      const allButtons = getButtons()

      const currentButton = allButtons.findIndex(item => item.id === id)

      if (currentButton > -1) {
        allButtons.splice(currentButton, 1)
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
    url: '/api/system/menu/button',
    type: 'post',
    response: config => {
      const newButton = config.body
      const allButtons = getButtons()
      const moduleButtons = allButtons.filter(item => item.moduleId === newButton.moduleId)

      const isRepeat = moduleButtons.some(item => item.fullName === newButton.fullName || item.entityCode === newButton.entityCode)

      if (!isRepeat) {
        newButton.id = Math.ceil(Math.random() * 100000000000000) + ''
        allButtons.push(newButton)
        return {
          code: 200,
          message: '操作成功'
        }
      }

      return {
        code: 400,
        message: '存在相同名称或编码'
      }
    }
  },
  {
    url: '/api/system/menu/button',
    type: 'put',
    response: config => {
      const button = config.body
      const allButtons = getButtons()

      const currentButton = allButtons.find(item => item.id === button.id)

      if (currentButton) {
        for (const key in currentButton) {
          currentButton[key] = button[key]
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
    url: '/api/system/menu/button/info',
    type: 'get',
    response: config => {
      const { id } = config.query
      const allButtons = getButtons()

      const currentButton = allButtons.find(item => item.id === id)

      if (currentButton) {
        return {
          code: 200,
          data: currentButton
        }
      }

      return {
        code: 400,
        message: '没有找到资源'
      }
    }
  },

  // columns
  {
    url: '/api/system/menu/column/list',
    type: 'get',
    response: config => {
      const { moduleId } = config.query
      const allColumns = getColumns()

      const moduleColumns = allColumns.filter(item => item.moduleId === moduleId)

      return {
        code: 200,
        data: {
          list: moduleColumns
        }
      }
    }
  },
  {
    url: '/api/system/menu/column',
    type: 'delete',
    response: config => {
      const { id } = config.body
      const allColumns = getColumns()

      const currentColumn = allColumns.findIndex(item => item.id === id)

      if (currentColumn > -1) {
        allColumns.splice(currentColumn, 1)
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
    url: '/api/system/menu/column',
    type: 'post',
    response: config => {
      const newColumn = config.body
      const allColumns = getColumns()
      const moduleColumns = allColumns.filter(item => item.moduleId === newColumn.moduleId)

      const isRepeat = moduleColumns.some(item => item.fullName === newColumn.fullName || item.entityCode === newColumn.entityCode)

      if (!isRepeat) {
        newColumn.id = Math.ceil(Math.random() * 100000000000000) + ''
        allColumns.push(newColumn)
        return {
          code: 200,
          message: '操作成功'
        }
      }

      return {
        code: 400,
        message: '存在相同名称或编码'
      }
    }
  },
  {
    url: '/api/system/menu/column',
    type: 'put',
    response: config => {
      const column = config.body
      const allColumns = getColumns()

      const currentColumn = allColumns.find(item => item.id === column.id)
      // 查重
      // code

      if (currentColumn) {
        for (const key in currentColumn) {
          currentColumn[key] = column[key]
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
    url: '/api/system/menu/column/info',
    type: 'get',
    response: config => {
      const { id } = config.query
      const allColumns = getColumns()

      const currentColumn = allColumns.find(item => item.id === id)

      if (currentColumn) {
        return {
          code: 200,
          data: currentColumn
        }
      }

      return {
        code: 400,
        message: '没有找到资源'
      }
    }
  },
  {
    url: '/api/system/menu/column/batchCreate',
    type: 'post',
    response: config => {
      const { moduleId, data } = config.body
      const allColumns = getColumns()

      data.forEach(item => {
        const newColumn = {}
        newColumn.id = Math.ceil(Math.random() * 100000000000000) + ''
        newColumn.moduleId = moduleId
        newColumn.enabledMark = 1
        newColumn.sortCode = null
        newColumn.fullName = item.fullName
        newColumn.entityCode = item.entityCode
        allColumns.push(newColumn)
      })

      return {
        code: 200,
        message: '操作成功'
      }
    }
  },

  // menus
  {
    url: '/api/system/menuList',
    type: 'get',
    response: config => {
      const menuList = getMenuList()
      return {
        code: 200,
        data: {
          list: menuList
        }
      }
    }
  },
  {
    url: '/api/system/menu/selector',
    type: 'get',
    response: config => {
      const { id } = config.query
      const menuList = getMenuList()
      const directory = menuList.filter(item => item.type === 1)

      if (!id) {
        return {
          code: 200,
          data: {
            list: directory
          }
        }
      }

      return {
        code: 200,
        data: {
          list: directory.filter(item => item.id !== id)
        }
      }
    }
  },
  {
    url: '/api/system/menu/info',
    type: 'get',
    response: config => {
      const { id } = config.query
      const menuList = getMenuList()

      const menu = menuList.find(item => item.id === id)

      if (menu) {
        return {
          code: 200,
          data: menu
        }
      }

      return {
        code: 400,
        message: '没有找到资源'
      }
    }
  },
  {
    url: '/api/system/menu',
    type: 'delete',
    response: config => {
      const { id } = config.body
      const menuList = getMenuList()

      const currentIndex = menuList.findIndex(item => item.id === id)

      // 如果有外键，则不允许删
      // code

      if (currentIndex > -1) {
        menuList.splice(currentIndex, 1)
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
    url: '/api/system/menu',
    type: 'post',
    response: config => {
      const newMenu = config.body
      const menuList = getMenuList()

      // 检验同名
      const isRepeat = menuList.some(item => item.fullName === newMenu.fullName)

      if (!isRepeat) {
        newMenu.id = Math.ceil(Math.random() * 100000000000000) + ''
        menuList.push(newMenu)
        return {
          code: 200,
          message: '操作成功'
        }
      }

      return {
        code: 400,
        message: '存在相同名称，请重新确认'
      }
    }
  },
  {
    url: '/api/system/menu',
    type: 'put',
    response: config => {
      const menu = config.body
      const menuList = getMenuList()

      const currentMenu = menuList.find(item => item.id === menu.id)

      if (currentMenu) {
        for (const key in currentMenu) {
          currentMenu[key] = menu[key]
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
  }
]
