import request from '@/utils/request'

export function getRoleList(data) {
  return request({
    url: '/api/permission/role/list',
    method: 'GET',
    data
  })
}

export function delRole(id) {
  return request({
    url: '/api/permission/role',
    method: 'DELETE',
    data: { id }
  })
}

export function createRole(data) {
  return request({
    url: '/api/permission/role',
    method: 'POST',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/api/permission/role',
    method: 'PUT',
    data
  })
}

export function getRoleInfo(id) {
  return request({
    url: '/api/permission/role/info',
    method: 'GET',
    data: { id }
  })
}

export function getAuthorizeValues(data) {
  return request({
    url: '/api/permission/role/Authorize',
    method: 'GET',
    data
  })
}

export function updateAuthorizeList(roleId, data) {
  return request({
    url: '/api/permission/role/Authorize',
    method: 'PUT',
    data: {
      roleId,
      data
    }
  })
}
