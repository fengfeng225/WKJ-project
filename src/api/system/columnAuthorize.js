import request from '@/utils/request'

export function getColumnAuthorizeList(menuId) {
  return request({
    url: `/api/system/menuColumn/list/${menuId}`,
    method: 'GET'
  })
}

export function delColumn(id) {
  return request({
    url: `/api/system/menuColumn/${id}`,
    method: 'DELETE'
  })
}

export function createColumn(data) {
  return request({
    url: `/api/system/menuColumn`,
    method: 'POST',
    data
  })
}

export function updateColumn(data) {
  return request({
    url: `/api/system/menuColumn/${data.id}`,
    method: 'PUT',
    data
  })
}

export function getColumnInfo(id) {
  return request({
    url: `/api/system/menuColumn/${id}`,
    method: 'GET'
  })
}

export function batchCreateColumn(data) {
  return request({
    url: `/api/system/menuColumn/batchCreate/${data.menuId}`,
    method: 'POST',
    data
  })
}
