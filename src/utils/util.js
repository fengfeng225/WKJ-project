export const deepClone = function(origin) {
  if (origin === undefined) {
    return undefined
  }

  return JSON.parse(JSON.stringify(origin))
}

export const getTreeData = function(list, parentId) {
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
