export const getMBStatusStyle = function(value) {
  switch (value) {
    case 0:
      return 'danger'
    case 1:
      return 'success'
    default:
      return 'warning'
  }
}

export const getMBStatusLabel = function(value) {
  switch (value) {
    case 0:
      return '盲'
    case 1:
      return '通'
    default:
      return '未知'
  }
}

// 表格专用
export const getCycleTypeLabel = function(row, column, cellValue, index) {
  switch (cellValue) {
    case 'short':
      return '短期'
    case 'long':
      return '长期'
    default:
      return '未知'
  }
}

export const getCheckingStatusStyle = function(value) {
  switch (value) {
    case 0:
      return 'info'
    case 1:
      return 'success'
    default:
      return 'warning'
  }
}

export const getCheckingStatusLabel = function(value) {
  switch (value) {
    case 0:
      return '待检查'
    case 1:
      return '已检查'
    default:
      return '未知'
  }
}

export const getCheckedStatusStyle = function(value) {
  switch (value) {
    case 1:
      return 'success'
    case -1:
      return 'danger'
    default:
      return 'warning'
  }
}

export const getCheckedStatusLabel = function(value) {
  switch (value) {
    case 1:
      return '正常'
    case -1:
      return '异常'
    default:
      return '未知'
  }
}
