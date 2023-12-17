import request from '@/utils/request'

export function getRoleList(data) {
  return request({
    url: '/api/permission/role',
    method: 'GET',
    data
  })
}

export function delRole(id) {
  return request({
    url: `/api/permission/role/${id}`,
    method: 'DELETE'
  })
}

export function createRole(data) {
  return request({
    url: `/api/permission/role`,
    method: 'POST',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/api/permission/role/${data.id}`,
    method: 'PUT',
    data
  })
}

export function getRoleInfo(id) {
  return request({
    url: `/api/permission/role/${id}`,
    method: 'GET'
  })
}

export function getAuthorizeValues(roleId, data) {
  return request({
    url: `/api/permission/role/Authorize/${roleId}`,
    method: 'GET',
    data
  })
}

export function updateAuthorizeList(roleId, data) {
  return request({
    url: `/api/permission/role/Authorize/${roleId}`,
    method: 'PUT',
    data
  })
}

export function getClassAuthorize(roleId) {
  return request({
    url: `/api/permission/role/classAuthorize/${roleId}`,
    method: 'GET'
  })
}

export function updateClassAuthorize(roleId, data) {
  return request({
    url: `/api/permission/role/classAuthorize/${roleId}`,
    method: 'PUT',
    data
  })
}
