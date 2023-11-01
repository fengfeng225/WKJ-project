import request from '@/utils/request'

export function getDictionaryList() {
  return request({
    url: '/api/admin/systemData/dictionaryList',
    method: 'GET'
  })
}

export function getDictionaryInfo(id) {
  return request({
    url: '/api/admin/systemData/dictionary/info',
    method: 'GET',
    data: { id }
  })
}

export function updateDictionary(data) {
  return request({
    url: '/api/admin/systemData/dictionary',
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
    url: '/api/admin/systemData/dictionary',
    method: 'DELETE',
    data: { id }
  })
}

export function getOptions(id, keyword) {
  return request({
    url: '/api/admin/systemData/dictionary/options',
    method: 'GET',
    data: { id, keyword }
  })
}

export function deleteOption(id) {
  return request({
    url: '/api/admin/systemData/dictionary/option',
    method: 'DELETE',
    data: { id }
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
    url: '/api/admin/systemData/dictionary/option',
    method: 'PUT',
    data
  })
}

export function getOptionInfo(id) {
  return request({
    url: '/api/admin/systemData/dictionary/option/info',
    method: 'GET',
    data: { id }
  })
}

export function getOptionsByCode(code) {
  return request({
    url: '/api/admin/systemData/dictionary/optionsByCode',
    method: 'GET',
    data: { code }
  })
}
