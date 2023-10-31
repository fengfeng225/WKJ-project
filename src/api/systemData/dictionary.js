import request from '@/utils/request'

export function getShortBills(data) {
  return request({
    url: '/api/admin/shortBills',
    method: 'GET',
    data
  })
}
