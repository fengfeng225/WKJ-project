const shortBills = [
  {
    id: '432701041243324485',
    group: '一班',
    name: '15万白油加氢',
    code: '033',
    pipDiameter: '40',
    description: 'C-601顶部出口线现场排空手阀后法兰',
    pipelineMediaName: '常顶油气',
    pipelineMediaTemperature: '230',
    pipelineMediaPressure: '0.1',
    size: '8',
    type: '8字盲板',
    material: '钢制',
    installTime: '2022.7',
    operators: '木胡太尔江',
    Manager: '王科举'
  },
  {
    id: '432701041243324484',
    group: '二班',
    name: '15万白油加氢',
    code: '111',
    pipDiameter: '40',
    description: 'C-601顶部出口线现场排空手阀后法兰',
    pipelineMediaName: '常顶油气',
    pipelineMediaTemperature: '230',
    pipelineMediaPressure: '0.1',
    size: '8',
    type: '8字盲板',
    material: '钢制',
    installTime: '2022.7',
    operators: '木胡太尔江',
    Manager: '王科举'
  },
  {
    id: '432701041243324483',
    group: '三班',
    name: '15万白油加氢',
    code: '056',
    pipDiameter: '40',
    description: 'C-601顶部出口线现场排空手阀后法兰',
    pipelineMediaName: '常顶油气',
    pipelineMediaTemperature: '230',
    pipelineMediaPressure: '0.1',
    size: '8',
    type: '8字盲板',
    material: '钢制',
    installTime: '2022.7',
    operators: '木胡太尔江',
    Manager: '王科举'
  }
]

module.exports = [
  {
    url: '/api/admin/shortBills',
    type: 'get',
    response: config => {
      const { keyword, currentPage, pageSize } = config.query
      let list = []
      const start = (currentPage - 1) * pageSize

      if (!keyword) {
        list = shortBills.slice(start, start + pageSize)
      } else {
        const specificList = shortBills.filter(item => item.code.includes(keyword))
        list = specificList.slice(start, start + pageSize)
      }

      return {
        code: 200,
        data: {
          pagination: {
            pageIndex: +currentPage,
            pageSize: +pageSize,
            total: list.length
          },
          list
        }
      }
    }
  }
]
