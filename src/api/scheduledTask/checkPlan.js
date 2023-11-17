import request from '@/utils/request'

export function checkPlanList(data) {
  return request({
    url: '/api/scheduledTask/checkPlan/list',
    method: 'GET',
    data
  })
}

export function checkPlanDelete(id) {
  return request({
    url: '/api/scheduledTask/checkPlan',
    method: 'DELETE',
    data: { id }
  })
}

export function checkPlanStop(id) {
  return request({
    url: '/api/scheduledTask/checkPlan/stop',
    method: 'PUT',
    data: { id }
  })
}

export function checkPlanEnable(id) {
  return request({
    url: '/api/scheduledTask/checkPlan/enable',
    method: 'PUT',
    data: { id }
  })
}
