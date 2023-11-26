import request from '@/utils/request'

export function getButtonAuthorizeList(menuId) {
  return request({
    url: `/api/system/menuButton/list/${menuId}`,
    method: 'GET'
  })
}

export function delButton(id) {
  return request({
    url: `/api/system/menuButton/${id}`,
    method: 'DELETE'
  })
}

export function createButton(data) {
  return request({
    url: '/api/system/menuButton',
    method: 'POST',
    data
  })
}

export function updateButton(data) {
  return request({
    url: `/api/system/menuButton/${data.id}`,
    method: 'PUT',
    data
  })
}

export function getButtonInfo(id) {
  return request({
    url: `/api/system/menuButton/${id}`,
    method: 'GET'
  })
}
