import request from '@/utils/request'

export function getAllUndergroundSludgeOilBills() {
  return request({
    url: '/api/admin/mutualChannelingPoint/undergroundSludgeOilBill/all',
    method: 'GET'
  })
}

export function getUndergroundSludgeOilBills(data) {
  return request({
    url: '/api/admin/mutualChannelingPoint/undergroundSludgeOilBill',
    method: 'GET',
    data
  })
}

export function createUndergroundSludgeOilBill(data) {
  return request({
    url: '/api/admin/mutualChannelingPoint/undergroundSludgeOilBill',
    method: 'POST',
    data
  })
}

export function updateUndergroundSludgeOilBill(data) {
  return request({
    url: `/api/admin/mutualChannelingPoint/undergroundSludgeOilBill/${data.id}`,
    method: 'PUT',
    data
  })
}

export function deleteUndergroundSludgeOilBill(id) {
  return request({
    url: `/api/admin/mutualChannelingPoint/undergroundSludgeOilBill/${id}`,
    method: 'DELETE'
  })
}

export function getUndergroundSludgeOilBillInfo(id) {
  return request({
    url: `/api/admin/mutualChannelingPoint/undergroundSludgeOilBill/${id}`,
    method: 'GET'
  })
}
