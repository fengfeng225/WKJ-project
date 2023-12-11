import request from '@/utils/request'

export function getCheckPlanList(data) {
  return request({
    url: '/api/scheduledTask/billCheckPlan',
    method: 'GET',
    data
  })
}

export function updateCheckPlan(data) {
  return request({
    url: `/api/scheduledTask/billCheckPlan/${data.id}`,
    method: 'PUT',
    data
  })
}

export function getCheckPlanInfo(id) {
  return request({
    url: `/api/scheduledTask/billCheckPlan/${id}`,
    method: 'GET'
  })
}

export function stopCheckPlan(id) {
  return request({
    url: `/api/scheduledTask/billCheckPlan/stop/${id}`,
    method: 'PUT'
  })
}

export function enableCheckPlan(id) {
  return request({
    url: `/api/scheduledTask/billCheckPlan/enable/${id}`,
    method: 'PUT'
  })
}

export function getCheckPlanLog(id, data) {
  return request({
    url: `/api/scheduledTask/billCheckPlan/${id}/log`,
    method: 'GET',
    data
  })
}
