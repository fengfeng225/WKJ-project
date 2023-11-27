import request from '@/utils/request'

export function getGroupCategories() {
  return request({
    url: `/api/admin/mb/class`,
    method: 'GET'
  })
}

export function createGroupCategory(data) {
  return request({
    url: `/api/admin/mb/class`,
    method: 'POST',
    data
  })
}

export function updateGroupCategory(data) {
  return request({
    url: `/api/admin/mb/class/${data.id}`,
    method: 'PUT',
    data
  })
}

export function deleteGroupCategory(id) {
  return request({
    url: `/api/admin/mb/class/${id}`,
    method: 'DELETE'
  })
}

export function getGroupCategoryInfo(id) {
  return request({
    url: `/api/admin/mb/class/${id}`,
    method: 'GET'
  })
}
