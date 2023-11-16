import request from '@/utils/request'

export function getColumnAuthorizeList(moduleId) {
  return request({
    url: '/api/system/menu/column/list',
    method: 'GET',
    data: { moduleId }
  })
}

export function delColumn(id) {
  return request({
    url: '/api/system/menu/column',
    method: 'DELETE',
    data: { id }
  })
}

export function createColumn(data) {
  return request({
    url: '/api/system/menu/column',
    method: 'POST',
    data
  })
}

export function updateColumn(data) {
  return request({
    url: '/api/system/menu/column',
    method: 'PUT',
    data
  })
}

export function getColumnInfo(id) {
  return request({
    url: '/api/system/menu/column/info',
    method: 'GET',
    data: { id }
  })
}

export function batchCreateColumn(data) {
  return request({
    url: '/api/system/menu/column/batchCreate',
    method: 'POST',
    data
  })
}
