import request from '@/utils/request'

export function getShortBills(data) {
  return request({
    url: '/api/admin/shortBills',
    method: 'GET',
    data
  })
}

export function createShortBill(data) {
  return request({
    url: '/api/admin/shortBill',
    method: 'POST',
    data
  })
}

export function updateShortBill(data) {
  return request({
    url: `/api/admin/shortBill`,
    method: 'PUT',
    data
  })
}

export function deleteShortBill(id) {
  return request({
    url: `/api/admin/shortBill`,
    method: 'DELETE',
    params: { id }
  })
}

export function getShortBillInfo(id) {
  return request({
    url: `/api/admin/shortBill/info`,
    method: 'GET',
    data: { id }
  })
}
