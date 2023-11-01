import request from '@/utils/request'

export function getGroupCategories() {
  return request({
    url: `/api/admin/mb/shortBill/groupCategories`,
    method: 'GET'
  })
}

export function createGroupCategory(data) {
  return request({
    url: `/api/admin/mb/groupCategory`,
    method: 'POST',
    data
  })
}

export function updateGroupCategory(data) {
  return request({
    url: `/api/admin/mb/groupCategory`,
    method: 'PUT',
    data
  })
}

export function deleteGroupCategory(id) {
  return request({
    url: `/api/admin/mb/groupCategory`,
    method: 'DELETE',
    data: { id }
  })
}

export function getGroupCategoryInfo(id) {
  return request({
    url: `/api/admin/mb/groupCategory/Info`,
    method: 'GET',
    data: { id }
  })
}