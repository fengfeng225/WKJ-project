import request from '@/utils/request'

export function getDeviceNameCategory() {
  return request({
    url: `/api/admin/shortBill/deviceNameCategory`,
    method: 'GET'
  })
}

export function getGroupCategories() {
  return request({
    url: `/api/admin/shortBill/GroupCategories`,
    method: 'GET'
  })
}
