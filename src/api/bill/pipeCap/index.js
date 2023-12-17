import request from '@/utils/request'

export function getAllPipeCapBills() {
  return request({
    url: '/api/admin/pipeCap/bill/all',
    method: 'GET'
  })
}

export function getPipeCapBills(data) {
  return request({
    url: '/api/admin/pipeCap/bill',
    method: 'GET',
    data
  })
}

export function createPipeCapBill(data) {
  return request({
    url: '/api/admin/pipeCap/bill',
    method: 'POST',
    data
  })
}

export function updatePipeCapBill(data) {
  return request({
    url: `/api/admin/pipeCap/bill/${data.id}`,
    method: 'PUT',
    data
  })
}

export function deletePipeCapBill(id) {
  return request({
    url: `/api/admin/pipeCap/bill/${id}`,
    method: 'DELETE'
  })
}

export function getPipeCapBillInfo(id) {
  return request({
    url: `/api/admin/pipeCap/bill/${id}`,
    method: 'GET'
  })
}
