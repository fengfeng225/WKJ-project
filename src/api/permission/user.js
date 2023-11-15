import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: '/api/permission/user/list',
    method: 'GET',
    data
  })
}

export function delUser(id) {
  return request({
    url: '/api/permission/user',
    method: 'DELETE',
    data: { id }
  })
}

export function createUser(data) {
  return request({
    url: '/api/permission/user',
    method: 'POST',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/api/permission/user',
    method: 'PUT',
    data
  })
}

export function getUserInfo(id) {
  return request({
    url: '/api/permission/user/info',
    method: 'GET',
    data: { id }
  })
}

export function resetUserPassword(data) {
  return request({
    url: '/api/permission/user/resetPassword',
    method: 'PUT',
    data
  })
}
