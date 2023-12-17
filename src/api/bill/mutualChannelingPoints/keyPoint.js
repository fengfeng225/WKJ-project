import request from '@/utils/request'

export function getAllKeyPointBills() {
  return request({
    url: '/api/admin/mutualChannelingPoint/keyPointBill/all',
    method: 'GET'
  })
}

export function getKeyPointBills(data) {
  return request({
    url: '/api/admin/mutualChannelingPoint/keyPointBill',
    method: 'GET',
    data
  })
}

export function createKeyPointBill(data) {
  return request({
    url: '/api/admin/mutualChannelingPoint/keyPointBill',
    method: 'POST',
    data
  })
}

export function updateKeyPointBill(data) {
  return request({
    url: `/api/admin/mutualChannelingPoint/keyPointBill/${data.id}`,
    method: 'PUT',
    data
  })
}

export function deleteKeyPointBill(id) {
  return request({
    url: `/api/admin/mutualChannelingPoint/keyPointBill/${id}`,
    method: 'DELETE'
  })
}

export function getKeyPointBillInfo(id) {
  return request({
    url: `/api/admin/mutualChannelingPoint/keyPointBill/${id}`,
    method: 'GET'
  })
}
