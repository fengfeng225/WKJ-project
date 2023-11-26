import request from '@/utils/request'

export function getMenuList(data) {
  return request({
    url: '/api/system/menu/list',
    method: 'GET',
    data
  })
}

export function delMenu(id) {
  return request({
    url: `/api/system/menu/${id}`,
    method: 'DELETE'
  })
}

export function createMenu(data) {
  return request({
    url: '/api/system/menu',
    method: 'POST',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: `/api/system/menu/${data.id}`,
    method: 'PUT',
    data
  })
}

export function getMenuInfo(id) {
  return request({
    url: `/api/system/menu/info/${id}`,
    method: 'GET'
  })
}

export function getMenuSelector(id) {
  return request({
    url: `/api/system/menu/selector/${id}`,
    method: 'GET'
  })
}
