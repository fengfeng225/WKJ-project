import request from '@/utils/request'

export function getAllOtherPointBills() {
  return request({
    url: '/api/admin/mutualChannelingPoint/otherPointBill/all',
    method: 'GET'
  })
}

export function getOtherPointBills(data) {
  return request({
    url: '/api/admin/mutualChannelingPoint/otherPointBill',
    method: 'GET',
    data
  })
}

export function createOtherPointBill(data) {
  return request({
    url: '/api/admin/mutualChannelingPoint/otherPointBill',
    method: 'POST',
    data
  })
}

export function updateOtherPointBill(data) {
  return request({
    url: `/api/admin/mutualChannelingPoint/otherPointBill/${data.id}`,
    method: 'PUT',
    data
  })
}

export function deleteOtherPointBill(id) {
  return request({
    url: `/api/admin/mutualChannelingPoint/otherPointBill/${id}`,
    method: 'DELETE'
  })
}

export function getOtherPointBillInfo(id) {
  return request({
    url: `/api/admin/mutualChannelingPoint/otherPointBill/${id}`,
    method: 'GET'
  })
}
