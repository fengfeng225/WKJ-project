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

export function getCheckProgress() {
  return request({
    url: '/api/admin/home/checkProgress',
    method: 'GET'
  })
}
