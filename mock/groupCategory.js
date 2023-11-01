const { getGroups, getShortBills, getLongBills } = require('./sqlDatabase')

module.exports = [
  {
    url: '/api/admin/mb/shortBill/groupCategories',
    type: 'get',
    response: config => {
      const list = getGroups()

      return {
        code: 200,
        data: {
          list
        }
      }
    }
  },
  {
    url: '/api/admin/mb/groupCategory',
    type: 'post',
    response: config => {
      const newGroup = config.body
      const groups = getGroups()

      if (groups.some(item => item.label === newGroup.label)) {
        return {
          code: 404,
          message: '该班已存在'
        }
      }

      newGroup.id = Math.ceil(Math.random() * 1000000000000000) + ''
      newGroup.creatorTime = Date.now()
      groups.push(newGroup)

      return {
        code: 200,
        message: '添加成功'
      }
    }
  },
  {
    url: '/api/admin/mb/groupCategory',
    type: 'put',
    response: config => {
      const { id, label } = config.body
      const groups = getGroups()

      if (groups.some(item => item.id !== id && item.label === label)) {
        return {
          code: 404,
          message: '该班已存在'
        }
      }

      const currentGroup = groups.find(item => item.id === id)
      if (currentGroup) {
        currentGroup.label = label
        return {
          code: 200,
          message: '修改成功'
        }
      }

      return {
        code: 404,
        message: '找不到该班'
      }
    }
  },
  {
    url: '/api/admin/mb/groupCategory',
    type: 'delete',
    response: config => {
      const { id } = config.body

      const hasBill = getShortBills().find(item => item.groupId === id) || getLongBills().find(item => item.groupId === id)
      if (hasBill) {
        return {
          code: 404,
          message: '删除失败，请先移除该班下所有的台账'
        }
      }

      const groups = getGroups()
      const currentGroupIndex = groups.findIndex(item => item.id === id)
      if (currentGroupIndex > -1) {
        groups.splice(currentGroupIndex, 1)
        return {
          code: 200,
          message: '添加成功'
        }
      }

      return {
        code: 404,
        message: '找不到该班'
      }
    }
  },
  {
    url: '/api/admin/mb/groupCategory/Info',
    type: 'get',
    response: config => {
      const { id } = config.query
      const groups = getGroups()
      const currentGroup = groups.find(item => item.id === id)
      if (currentGroup) {
        return {
          code: 200,
          data: currentGroup
        }
      }

      return {
        code: 404,
        message: '找不到该班'
      }
    }
  }
]
