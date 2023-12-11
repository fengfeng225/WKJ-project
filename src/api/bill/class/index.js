import request from '@/utils/request'

export function getClassWithCheckStatus() {
  return request({
    url: `/api/admin/bill/class/checkStatus`,
    method: 'GET'
  })
}

export function getClasses() {
  return request({
    url: `/api/admin/bill/class`,
    method: 'GET'
  })
}

export function createClass(data) {
  return request({
    url: `/api/admin/bill/class`,
    method: 'POST',
    data
  })
}

export function updateClass(data) {
  return request({
    url: `/api/admin/bill/class/${data.id}`,
    method: 'PUT',
    data
  })
}

export function deleteClass(id) {
  return request({
    url: `/api/admin/bill/class/${id}`,
    method: 'DELETE'
  })
}

export function getClassInfo(id) {
  return request({
    url: `/api/admin/bill/class/${id}`,
    method: 'GET'
  })
}

export function getCheckRecords(id, type) {
  return request({
    url: `/api/admin/bill/class/${id}/checkRecords/${type}`,
    method: 'GET'
  })
}

export function fixRecord(data) {
  return request({
    url: `/api/admin/bill/class/checkRecord/fix/${data.id}`,
    method: 'PUT',
    data
  })
}

export function checkAll(data) {
  return request({
    url: `/api/admin/bill/class/checkAll`,
    method: 'PUT',
    data
  })
}
