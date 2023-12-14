import request from '@/utils/request'

export function getLogList(category, data) {
  return request({
    url: `/api/system/log/${category}`,
    method: 'GET',
    data
  })
}

export function delLog(data) {
  return request({
    url: '/api/system/log',
    method: 'DELETE',
    data
  })
}
