import request from '@/utils/request'

export function getAllHeatExchangerBills() {
  return request({
    url: '/api/admin/mutualChannelingPoint/heatExchangerBill/all',
    method: 'GET'
  })
}

export function getHeatExchangerBills(data) {
  return request({
    url: '/api/admin/mutualChannelingPoint/heatExchangerBill',
    method: 'GET',
    data
  })
}

export function createHeatExchangerBill(data) {
  return request({
    url: '/api/admin/mutualChannelingPoint/heatExchangerBill',
    method: 'POST',
    data
  })
}

export function updateHeatExchangerBill(data) {
  return request({
    url: `/api/admin/mutualChannelingPoint/heatExchangerBill/${data.id}`,
    method: 'PUT',
    data
  })
}

export function deleteHeatExchangerBill(id) {
  return request({
    url: `/api/admin/mutualChannelingPoint/heatExchangerBill/${id}`,
    method: 'DELETE'
  })
}

export function getHeatExchangerBillInfo(id) {
  return request({
    url: `/api/admin/mutualChannelingPoint/heatExchangerBill/${id}`,
    method: 'GET'
  })
}
