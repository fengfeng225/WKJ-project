/**
 * @param {string} url
 * @returns {Object}
 */
function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

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

module.exports = {
  param2Obj,
  deepClone,
  getTreeData,
  getBillsFromTree
}
