const { getCheckPlanList } = require('./sqlDatabase')

module.exports = [
  {
    url: '/api/scheduledTask/checkPlan/list',
    type: 'get',
    response: config => {
      const { keyword } = config.query
      const checkPlanList = getCheckPlanList()

      return {
        code: 200,
        data: {
          list: checkPlanList
        }
      }
    }
  },
  {
    url: '/api/scheduledTask/checkPlan/info',
    type: 'get',
    response: config => {
      const { id } = config.query
      const checkPlanList = getCheckPlanList()

      return {
        code: 200,
        data: checkPlanList.find(item => item.id === id)
      }
    }
  }
]
