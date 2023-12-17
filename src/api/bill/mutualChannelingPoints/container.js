import request from '@/utils/request'

export function getAllContainerBills() {
  return request({
    url: '/api/admin/mutualChannelingPoint/containerBill/all',
    method: 'GET'
  })
}

export function getContainerBills(data) {
  return request({
    url: '/api/admin/mutualChannelingPoint/containerBill',
    method: 'GET',
    data
  })
}

export function createContainerBill(data) {
  return request({
    url: '/api/admin/mutualChannelingPoint/containerBill',
    method: 'POST',
    data
  })
}

export function updateContainerBill(data) {
  return request({
    url: `/api/admin/mutualChannelingPoint/containerBill/${data.id}`,
    method: 'PUT',
    data
  })
}

export function deleteContainerBill(id) {
  return request({
    url: `/api/admin/mutualChannelingPoint/containerBill/${id}`,
    method: 'DELETE'
  })
}

export function getContainerBillInfo(id) {
  return request({
    url: `/api/admin/mutualChannelingPoint/containerBill/${id}`,
    method: 'GET'
  })
}
