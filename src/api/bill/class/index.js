import request from '@/utils/request'

export function getClassWithCheckStatus(data) {
  return request({
    url: `/api/admin/bill/class/checkStatus`,
    method: 'GET',
    data
  })
}

export function getParentClassWithCheckStatus() {
  return request({
    url: `/api/admin/bill/class/parentCheckStatus`,
    method: 'GET'
  })
}

export function getClassBasic() {
  return request({
    url: `/api/admin/bill/class/basic`,
    method: 'GET'
  })
}

export function getClassSelector() {
  return request({
    url: `/api/admin/bill/class/basic/selector`,
    method: 'GET'
  })
}

export function getClassLeaf() {
  return request({
    url: `/api/admin/bill/class/basic/leaf`,
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
