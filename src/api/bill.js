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

export function getDeletedBills(data) {
  return request({
    url: `/api/admin/deletedBills`,
    method: 'GET',
    data
  })
}

export function restoreBill(id, cycleType) {
  return request({
    url: `/api/admin/restoreBill`,
    method: 'GET',
    data: { id, cycleType }
  })
}

export function getDeviceNameCategory() {
  return request({
    url: `/api/admin/shortBill/deviceNameCategory`,
    method: 'GET'
  })
}
