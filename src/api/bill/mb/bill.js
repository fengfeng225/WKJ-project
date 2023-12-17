import request from '@/utils/request'

export function getAllShortBills() {
  return request({
    url: '/api/admin/mb/allShortBill',
    method: 'GET'
  })
}

export function getShortBills(data) {
  return request({
    url: '/api/admin/mb/shortBill',
    method: 'GET',
    data
  })
}

export function createShortBill(data) {
  return request({
    url: '/api/admin/mb/shortBill',
    method: 'POST',
    data
  })
}

export function updateShortBill(data) {
  return request({
    url: `/api/admin/mb/shortBill/${data.id}`,
    method: 'PUT',
    data
  })
}

export function deleteShortBill(id) {
  return request({
    url: `/api/admin/mb/shortBill/${id}`,
    method: 'DELETE'
  })
}

export function getShortBillInfo(id) {
  return request({
    url: `/api/admin/mb/shortBill/${id}`,
    method: 'GET'
  })
}

export function getAllLongBills() {
  return request({
    url: '/api/admin/mb/allLongBill',
    method: 'GET'
  })
}

export function getLongBills(data) {
  return request({
    url: '/api/admin/mb/longBill',
    method: 'GET',
    data
  })
}

export function createLongBill(data) {
  return request({
    url: '/api/admin/mb/longBill',
    method: 'POST',
    data
  })
}

export function updateLongBill(data) {
  return request({
    url: `/api/admin/mb/longBill/${data.id}`,
    method: 'PUT',
    data
  })
}

export function deleteLongBill(id) {
  return request({
    url: `/api/admin/mb/longBill/${id}`,
    method: 'DELETE'
  })
}

export function getLongBillInfo(id) {
  return request({
    url: `/api/admin/mb/LongBill/${id}`,
    method: 'GET'
  })
}

export function getDisassembleDetails(data) {
  return request({
    url: `/api/admin/mb/bill/disassembleDetails`,
    method: 'GET',
    data
  })
}

export function removeDisassembleDetail(id) {
  return request({
    url: `/api/admin/mb/bill/disassembleDetail/${id}`,
    method: 'DELETE'
  })
}
