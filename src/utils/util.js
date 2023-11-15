export const deepClone = function(origin) {
  if (origin === undefined) {
    return undefined
  }

  return JSON.parse(JSON.stringify(origin))
}

export const getTreeData = function(list, parentId, parentIdNames = ['parentId']) {
  const node = list.filter(item => {
    return parentIdNames.some(name => item[name] === parentId)
  })

  if (node.length === 0) return []

  node.forEach(item => {
    if (!item.isLeaf) {
      const childNodes = getTreeData(list, item.id, parentIdNames)
      item.children = childNodes
    }
  })

  return node
}
