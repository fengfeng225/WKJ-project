const { getShortBills, getLongBills } = require('./sqlDatabase')

module.exports = [
  {
    url: '/api/admin/mb/shortBills',
    type: 'get',
    response: config => {
      const { groupId, keyword, currentPage = 1, pageSize = 20, queryJson } = config.query
      const enableList = getShortBills().filter(item => !item.deleteMark)
      let specificGroupList
      let list = []
      const start = (currentPage - 1) * pageSize

      if (!groupId || groupId === '-1') specificGroupList = enableList
      else specificGroupList = enableList.filter(item => item.groupId === groupId)

      if (queryJson) {
        const names = JSON.parse(queryJson)
        if (!Array.isArray(names)) {
          return {
            code: 404,
            message: '查询参数错误，请重试'
          }
        }
        specificGroupList = specificGroupList.filter(item => names.includes(item.name))
      }

      if (!keyword) {
        list = specificGroupList.slice(start, start + pageSize)
      } else {
        const listIncludeKeyword = specificGroupList.filter(item => item.code.includes(keyword))
        list = listIncludeKeyword.slice(start, start + pageSize)
      }

      return {
        code: 200,
        data: {
          pagination: {
            pageIndex: +currentPage,
            pageSize: +pageSize,
            total: list.length
          },
          list
        }
      }
    }
  },
  {
    url: '/api/admin/mb/shortBill/info',
    type: 'get',
    response: config => {
      const { id } = config.query
      const bill = getShortBills().find(item => item.id === id)

      if (bill) {
        return {
          code: 200,
          data: bill
        }
      }

      return {
        code: 404,
        message: '找不到资源'
      }
    }
  },
  {
    url: '/api/admin/mb/shortBill',
    type: 'put',
    response: config => {
      const bill = config.body
      const oldBill = getShortBills().find(item => item.id === bill.id)

      if (oldBill) {
        for (const key in bill) {
          oldBill[key] = bill[key]
        }
        return {
          code: 200,
          message: '操作成功'
        }
      }

      return {
        code: 404,
        message: '找不到资源'
      }
    }
  },
  {
    url: '/api/admin/mb/shortBill',
    type: 'post',
    response: config => {
      const bill = config.body

      bill.id = Math.ceil(Math.random() * 1000000000000000) + ''
      bill.creatorTime = Date.now()
      getShortBills().push(bill)
      return {
        code: 200,
        message: '操作成功'
      }
    }
  },
  {
    url: '/api/admin/mb/shortBill',
    type: 'delete',
    response: config => {
      const { id } = config.query

      const bill = getShortBills().findIndex(item => item.id === id)

      if (bill > -1) {
        getShortBills()[bill].deleteMark = 1
        return {
          code: 200,
          message: '操作成功'
        }
      }

      return {
        code: 404,
        message: '找不到资源'
      }
    }
  },
  {
    url: '/api/admin/mb/shortBill/deviceNameCategory',
    type: 'get',
    response: config => {
      const list = new Set()
      getShortBills().forEach(item => {
        list.add(item.name)
      })

      return {
        code: 200,
        data: {
          list
        }
      }
    }
  },

  {
    url: '/api/admin/mb/deletedBills',
    type: 'get',
    response: config => {
      const { groupId, keyword, currentPage = 1, pageSize = 20, queryJson } = config.query
      const shortDeleted = getShortBills().filter(item => item.deleteMark === 1)
      const longDeleted = getLongBills().filter(item => item.deleteMark === 1)
      const deletedList = shortDeleted.concat(longDeleted)
      let specificGroupList
      let list = []
      const start = (currentPage - 1) * pageSize

      if (!groupId) specificGroupList = deletedList
      else specificGroupList = deletedList.filter(item => item.groupId === groupId)

      if (queryJson) {
        const names = JSON.parse(queryJson)
        if (!Array.isArray(names)) {
          return {
            code: 404,
            message: '查询参数错误，请重试'
          }
        }
        specificGroupList = specificGroupList.filter(item => names.includes(item.name))
      }

      if (!keyword) {
        list = specificGroupList.slice(start, start + pageSize)
      } else {
        const listIncludeKeyword = specificGroupList.filter(item => item.code.includes(keyword))
        list = listIncludeKeyword.slice(start, start + pageSize)
      }

      return {
        code: 200,
        data: {
          pagination: {
            pageIndex: +currentPage,
            pageSize: +pageSize,
            total: list.length
          },
          list
        }
      }
    }
  },
  {
    url: '/api/admin/mb/restoreBill',
    type: 'get',
    response: config => {
      const { id, cycleType } = config.query
      let bill

      if (cycleType === 'short') {
        bill = getShortBills().find(item => item.id === id)
      } else {
        bill = getLongBills().find(item => item.id === id)
      }

      if (bill) {
        bill.deleteMark = 0
        return {
          code: 200,
          message: '操作成功'
        }
      }

      return {
        code: 404,
        message: '找不到资源'
      }
    }
  }
]
