import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: '/api/permission/user',
    method: 'GET',
    data
  })
}

export function delUser(id) {
  return request({
    url: `/api/permission/user/${id}`,
    method: 'DELETE'
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
    url: `/api/permission/user/${data.id}`,
    method: 'PUT',
    data
  })
}

export function getUserInfo(id) {
  return request({
    url: `/api/permission/user/${id}`,
    method: 'GET'
  })
}

export function updatePassword(data) {
  return request({
    url: '/api/permission/user/updatePassword',
    method: 'put',
    data
  })
}

export function resetUserPassword(userId, data) {
  return request({
    url: `/api/permission/user/resetPassword/${userId}`,
    method: 'PUT',
    data
  })
}
