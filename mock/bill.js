const shortBills = [
  {
    id: '432701041243324485',
    groupId: '403034187151441989',
    name: '15万白油加氢',
    code: '033',
    pipDiameter: 40,
    description: 'C-601顶部出口线现场排空手阀后法兰',
    pipelineMediaName: '常顶油气',
    pipelineMediaTemperature: 230,
    pipelineMediaPressure: 0.1,
    size: 8,
    type: '8字盲板',
    material: '钢制',
    installTime: '2022.7',
    operators: '木胡太尔江',
    Manager: '王科举'
  },
  {
    id: '432701041243324480',
    groupId: '403034187151441989',
    name: '16万白油加氢',
    code: '039',
    pipDiameter: 40,
    description: 'C-601顶部出口线现场排空手阀后法兰',
    pipelineMediaName: '常顶油气',
    pipelineMediaTemperature: 230,
    pipelineMediaPressure: 0.1,
    size: 8,
    type: '8字盲板',
    material: '钢制',
    installTime: '2022.7',
    operators: '木胡太尔江',
    Manager: '王科举'
  },
  {
    id: '432701041243324484',
    groupId: '403034187151441988',
    name: '16万白油加氢',
    code: '111',
    pipDiameter: 40,
    description: 'C-601顶部出口线现场排空手阀后法兰',
    pipelineMediaName: '常顶油气',
    pipelineMediaTemperature: 230,
    pipelineMediaPressure: 0.1,
    size: 8,
    type: '8字盲板',
    material: '钢制',
    installTime: '2022.7',
    operators: '木胡太尔江',
    Manager: '王科举'
  },
  {
    id: '432701041243324483',
    groupId: '403034187151441987',
    name: '15万白油加氢',
    code: '056',
    pipDiameter: 40,
    description: 'C-601顶部出口线现场排空手阀后法兰',
    pipelineMediaName: '常顶油气',
    pipelineMediaTemperature: 230,
    pipelineMediaPressure: 0.1,
    size: 8,
    type: '8字盲板',
    material: '钢制',
    installTime: '2022.7',
    operators: '木胡太尔江',
    Manager: '王科举'
  }
]

const groupTree = [
  {
    enabledMark: 1,
    label: '全部',
    id: '402684125602906181',
    isLeaf: false,
    parentId: '-1'
  },
  {
    enabledMark: 1,
    label: '白油一班',
    id: '403034187151441989',
    isLeaf: true,
    parentId: '402684125602906181'
  },
  {
    enabledMark: 1,
    label: '白油二班',
    id: '403034187151441988',
    isLeaf: true,
    parentId: '402684125602906181'
  },
  {
    enabledMark: 1,
    label: '白油三班',
    id: '403034187151441987',
    isLeaf: true,
    parentId: '402684125602906181'
  },
  {
    enabledMark: 1,
    label: '白油四班',
    id: '403034187151441986',
    isLeaf: true,
    parentId: '402684125602906181'
  },
  {
    enabledMark: 1,
    label: '高加一班',
    id: '403034187151441985',
    isLeaf: true,
    parentId: '402684125602906181'
  },
  {
    enabledMark: 1,
    label: '高加二班',
    id: '403034187151441984',
    isLeaf: true,
    parentId: '402684125602906181'
  },
  {
    enabledMark: 1,
    label: '高加三班',
    id: '403034187151441983',
    isLeaf: true,
    parentId: '402684125602906181'
  },
  {
    enabledMark: 1,
    label: '高加四班',
    id: '403034187151441982',
    isLeaf: true,
    parentId: '402684125602906181'
  }
]

const getTreeData = function(list, parentId) {
  const node = list.filter(item => item.parentId === parentId)

  if (node.length === 0) return []

  node.forEach(item => {
    if (!item.isLeaf) {
      const childNodes = getTreeData(list, item.id)
      item.children = childNodes
    }
  })

  return node
}

const getCurrentGroupTree = function(tree, id) {
  for (const item of tree) {
    if (item.id === id) return item
    if (!item.isLeaf) return getCurrentGroupTree(item.children, id)
  }
}

const getEveryNodeId = function(tree) {
  const ids = []
  ids.push(tree.id)

  if (!tree.isLeaf) {
    tree.children.forEach(item => {
      ids.push(...getEveryNodeId(item))
    })
  }

  return ids
}

const getBillsFromTree = function(groupId, tree, data) {
  const treeData = getTreeData(tree, '-1')
  const currentNodeTree = getCurrentGroupTree(treeData, groupId)
  const ids = getEveryNodeId(currentNodeTree)
  return data.filter(item => ids.includes(item.groupId))
}

module.exports = [
  {
    url: '/api/admin/shortBills',
    type: 'get',
    response: config => {
      const { groupId, keyword, currentPage = 1, pageSize = 20, queryJson } = config.query
      let specificGroupList
      let list = []
      const start = (currentPage - 1) * pageSize

      if (!groupId) specificGroupList = shortBills
      else specificGroupList = getBillsFromTree(groupId, groupTree, shortBills)

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
    url: '/api/admin/shortBill/info',
    type: 'get',
    response: config => {
      const { id } = config.query
      const bill = shortBills.find(item => item.id === id)

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
    url: '/api/admin/shortBill',
    type: 'put',
    response: config => {
      const bill = config.body
      const oldBill = shortBills.find(item => item.id === bill.id)

      if (oldBill) {
        for (const key in bill) {
          if (key !== 'id') oldBill[key] = bill[key]
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
    url: '/api/admin/shortBill',
    type: 'post',
    response: config => {
      const bill = config.body

      const res = shortBills.find(item => item.code === bill.code)

      if (!res) {
        bill.id = Math.ceil(Math.random() * 1000000000) + ''
        shortBills.push(bill)
        return {
          code: 200,
          message: '操作成功'
        }
      }

      return {
        code: 500,
        message: '已经存在相同的编号'
      }
    }
  },
  {
    url: '/api/admin/shortBill',
    type: 'delete',
    response: config => {
      const { id } = config.query

      const bill = shortBills.findIndex(item => item.id === id)

      if (bill > 0) {
        shortBills.splice(bill, 1)
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
    url: '/api/admin/shortBill/deviceNameCategory',
    type: 'get',
    response: config => {
      const list = new Set()
      shortBills.forEach(item => {
        list.add(item.name)
      })

      return {
        code: 200,
        data: [...list]
      }
    }
  },
  {
    url: '/api/admin/shortBill/GroupCategories',
    type: 'get',
    response: config => {
      const treeData = getTreeData(groupTree, '-1')

      return {
        code: 200,
        data: treeData
      }
    }
  }
]
