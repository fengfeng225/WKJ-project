import request from '@/utils/request'

export function getMenuList(data) {
  return request({
    url: '/api/system/menuList',
    method: 'GET',
    data
  })
}

export function delMenu(id) {
  return request({
    url: '/api/system/menu',
    method: 'DELETE',
    data: { id }
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
    url: '/api/system/menu',
    method: 'PUT',
    data
  })
}

export function getMenuInfo(id) {
  return request({
    url: '/api/system/menu/info',
    method: 'GET',
    data: { id }
  })
}

export function getMenuSelector(id) {
  return request({
    url: '/api/system/menu/selector',
    method: 'GET',
    data: { id }
  })
}
