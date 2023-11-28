import request from '@/utils/request'

export function getDictionaryList() {
  return request({
    url: '/api/admin/systemData/dictionary',
    method: 'GET'
  })
}

export function getDictionaryInfo(id) {
  return request({
    url: `/api/admin/systemData/dictionary/${id}`,
    method: 'GET'
  })
}

export function updateDictionary(data) {
  return request({
    url: `/api/admin/systemData/dictionary/${data.id}`,
    method: 'PUT',
    data
  })
}

export function createDictionary(data) {
  return request({
    url: '/api/admin/systemData/dictionary',
    method: 'POST',
    data
  })
}

export function deleteDictionary(id) {
  return request({
    url: `/api/admin/systemData/dictionary/${id}`,
    method: 'DELETE'
  })
}

export function getOptions(id, data) {
  return request({
    url: `/api/admin/systemData/dictionary/${id}/option`,
    method: 'GET',
    data
  })
}

export function deleteOption(id) {
  return request({
    url: `/api/admin/systemData/dictionary/option/${id}`,
    method: 'DELETE'
  })
}

export function createOption(data) {
  return request({
    url: '/api/admin/systemData/dictionary/option',
    method: 'POST',
    data
  })
}

export function updateOption(data) {
  return request({
    url: `/api/admin/systemData/dictionary/option/${data.id}`,
    method: 'PUT',
    data
  })
}

export function getOptionInfo(id) {
  return request({
    url: `/api/admin/systemData/dictionary/option/${id}`,
    method: 'GET'
  })
}

export function getOptionsByCode(code) {
  return request({
    url: `/api/admin/systemData/dictionary/optionsByCode/${code}`,
    method: 'GET'
  })
}
