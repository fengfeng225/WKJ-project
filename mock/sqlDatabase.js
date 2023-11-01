// 表1 长期盲板台账
const mbLongBills = [
  {
    id: '432701041243324333',
    groupId: '403034187151441989',
    name: '15万白油加氢',
    code: '001',
    status: 0,
    pipDiameter: 40,
    description: 'C-601顶部出口线现场排空手阀后法兰',
    pipelineMediaName: '常顶油气',
    pipelineMediaTemperature: 230,
    pipelineMediaPressure: 0.1,
    size: 8,
    type: '8字盲板',
    material: '钢制',
    disassembleTime: 1698702548000,
    operator: 'mhtej',
    Manager: '王科举',
    creatorTime: 1638702548000,
    deleteMark: 0,
    cycleType: 'long'
  }
]

// 表2 短期盲板台账
const mbShortBills = [
  {
    id: '432701041243324485',
    groupId: '403034187151441989',
    name: '15万白油加氢',
    code: '033',
    status: 0,
    pipDiameter: 40,
    description: 'C-601顶部出口线现场排空手阀后法兰',
    pipelineMediaName: '常顶油气',
    pipelineMediaTemperature: 230,
    pipelineMediaPressure: 0.1,
    size: 8,
    type: '8字盲板',
    material: '钢制',
    disassembleTime: 1698702548000,
    operator: 'mhtej',
    Manager: '王科举',
    creatorTime: 1638702548000,
    deleteMark: 0,
    cycleType: 'short'
  },
  {
    id: '432701041243324480',
    groupId: '403034187151441989',
    name: '16万白油加氢',
    code: '039',
    status: 1,
    pipDiameter: 40,
    description: 'C-601顶部出口线现场排空手阀后法兰',
    pipelineMediaName: '常顶油气',
    pipelineMediaTemperature: 230,
    pipelineMediaPressure: 0.1,
    size: 8,
    type: '8字盲板',
    material: '钢制',
    disassembleTime: 1698762548000,
    operator: 'mhtej',
    Manager: '王科举',
    creatorTime: 1638702548000,
    deleteMark: 0,
    cycleType: 'short'
  },
  {
    id: '432701041243324484',
    groupId: '403034187151441988',
    name: '16万白油加氢',
    code: '111',
    status: 1,
    pipDiameter: 40,
    description: 'C-601顶部出口线现场排空手阀后法兰',
    pipelineMediaName: '常顶油气',
    pipelineMediaTemperature: 230,
    pipelineMediaPressure: 0.1,
    size: 8,
    type: '8字盲板',
    material: '钢制',
    disassembleTime: 1698761048000,
    operator: 'mhtej',
    Manager: '王科举',
    creatorTime: 1638702548000,
    deleteMark: 0,
    cycleType: 'short'
  },
  {
    id: '432701041243324483',
    groupId: '403034187151441987',
    name: '15万白油加氢',
    code: '056',
    status: 0,
    pipDiameter: 40,
    description: 'C-601顶部出口线现场排空手阀后法兰',
    pipelineMediaName: '常顶油气',
    pipelineMediaTemperature: 230,
    pipelineMediaPressure: 0.1,
    size: 8,
    type: '8字盲板',
    material: '钢制',
    disassembleTime: 1698732548000,
    operator: 'mhtej',
    Manager: '王科举',
    creatorTime: 1638702548000,
    deleteMark: 0,
    cycleType: 'short'
  }
]

// 表3 已删除盲板台账

// 表4 盲板班组
const mbGroups = [
  {
    label: '白油一班',
    id: '403034187151441989',
    creatorTime: 1638702548000
  },
  {
    label: '白油二班',
    id: '403034187151441988',
    creatorTime: 1638702548000
  },
  {
    label: '白油三班',
    id: '403034187151441987',
    creatorTime: 1638702548000
  },
  {
    label: '白油四班',
    id: '403034187151441986',
    creatorTime: 1638702548000
  },
  {
    label: '高加一班',
    id: '403034187151441985',
    creatorTime: 1638702548000
  },
  {
    label: '高加二班',
    id: '403034187151441984',
    creatorTime: 1638702548000
  },
  {
    label: '高加三班',
    id: '403034187151441983',
    creatorTime: 1638702548000
  },
  {
    label: '高加四班',
    id: '403034187151441982',
    creatorTime: 1638702548000
  }
]

// 表5 需配置选项的所有字段
const dictionaryList = [
  {
    fullName: '盲板材质',
    entityCode: 'mb-material',
    description: 'for test',
    id: '456992670183587908'
  },
  {
    fullName: '盲板形式',
    entityCode: 'mb-style',
    description: 'for test',
    id: '456992670183587909'
  },
  {
    fullName: '操作人员',
    entityCode: 'operator',
    description: 'for test',
    id: '456992670183587910'
  }
]

// 表6 所有选项
const options = [
  {
    fullName: '小明',
    entityCode: 'xm',
    description: 'for test',
    id: '456992823711891525',
    dictionaryId: '456992670183587910'
  },
  {
    fullName: '小王',
    entityCode: 'xw',
    description: 'for test',
    id: '456992823711891524',
    dictionaryId: '456992670183587910'
  },
  {
    fullName: '木胡太尔江',
    entityCode: 'mhtej',
    description: 'for test',
    id: '456992823711891523',
    dictionaryId: '456992670183587910'
  }
]

const getShortBills = function() {
  return mbShortBills
}

const getLongBills = function() {
  return mbLongBills
}

const getGroups = function() {
  return mbGroups
}

const getDictionaryList = function() {
  return dictionaryList
}

const getOptions = function() {
  return options
}

module.exports = {
  getShortBills,
  getLongBills,
  getGroups,
  getDictionaryList,
  getOptions
}
