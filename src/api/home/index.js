import request from '@/utils/request'

export function getSumBills() {
  return request({
    url: '/api/admin/home/sumBills',
    method: 'GET'
  })
}

export function getNewCheckRecords() {
  return request({
    url: '/api/admin/home/newCheckRecord',
    method: 'GET'
  })
}
