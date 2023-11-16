import request from '@/utils/request'

export function getButtonAuthorizeList(moduleId) {
  return request({
    url: '/api/system/menu/button/list',
    method: 'GET',
    data: { moduleId }
  })
}

export function delButton(id) {
  return request({
    url: '/api/system/menu/button',
    method: 'DELETE',
    data: { id }
  })
}

export function createButton(data) {
  return request({
    url: '/api/system/menu/button',
    method: 'POST',
    data
  })
}

export function updateButton(data) {
  return request({
    url: '/api/system/menu/button',
    method: 'PUT',
    data
  })
}

export function getButtonInfo(id) {
  return request({
    url: '/api/system/menu/button/info',
    method: 'GET',
    data: { id }
  })
}
