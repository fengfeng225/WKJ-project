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
