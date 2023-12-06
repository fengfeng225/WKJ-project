import request from '@/utils/request'

export function getClassWithCheckStatus() {
  return request({
    url: `/api/admin/mb/classWithCheckStatus`,
    method: 'GET'
  })
}

export function createClass(data) {
  return request({
    url: `/api/admin/mb/class`,
    method: 'POST',
    data
  })
}

export function updateClass(data) {
  return request({
    url: `/api/admin/mb/class/${data.id}`,
    method: 'PUT',
    data
  })
}

export function deleteClass(id) {
  return request({
    url: `/api/admin/mb/class/${id}`,
    method: 'DELETE'
  })
}

export function getClassInfo(id) {
  return request({
    url: `/api/admin/mb/class/${id}`,
    method: 'GET'
  })
}
