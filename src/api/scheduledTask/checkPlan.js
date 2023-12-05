import request from '@/utils/request'

export function getCheckPlanList(data) {
  return request({
    url: '/api/scheduledTask/checkPlan',
    method: 'GET',
    data
  })
}

export function updateCheckPlan(data) {
  return request({
    url: `/api/scheduledTask/checkPlan/${data.id}`,
    method: 'PUT',
    data
  })
}

export function getCheckPlanInfo(id) {
  return request({
    url: `/api/scheduledTask/checkPlan/${id}`,
    method: 'GET'
  })
}

export function stopCheckPlan(id) {
  return request({
    url: `/api/scheduledTask/checkPlan/stop/${id}`,
    method: 'PUT'
  })
}

export function enableCheckPlan(id) {
  return request({
    url: `/api/scheduledTask/checkPlan/enable/${id}`,
    method: 'PUT'
  })
}

export function getCheckPlanLog(id, data) {
  return request({
    url: `/api/scheduledTask/checkPlan/${id}/log`,
    method: 'GET',
    data
  })
}
