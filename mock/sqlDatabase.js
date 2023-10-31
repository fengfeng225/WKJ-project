const longBills = [
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
    operators: '木胡太尔江',
    Manager: '王科举',
    creatorTime: 1638702548000,
    deleteMark: 0,
    cycleType: 'long'
  }
]

const shortBills = [
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
    operators: '木胡太尔江',
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
    operators: '木胡太尔江',
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
    operators: '木胡太尔江',
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
    operators: '木胡太尔江',
    Manager: '王科举',
    creatorTime: 1638702548000,
    deleteMark: 0,
    cycleType: 'short'
  }
]

const groups = [
  {
    enabledMark: 1,
    label: '白油一班',
    id: '403034187151441989',
    creatorTime: 1638702548000
  },
  {
    enabledMark: 1,
    label: '白油二班',
    id: '403034187151441988',
    creatorTime: 1638702548000
  },
  {
    enabledMark: 1,
    label: '白油三班',
    id: '403034187151441987',
    creatorTime: 1638702548000
  },
  {
    enabledMark: 1,
    label: '白油四班',
    id: '403034187151441986',
    creatorTime: 1638702548000
  },
  {
    enabledMark: 1,
    label: '高加一班',
    id: '403034187151441985',
    creatorTime: 1638702548000
  },
  {
    enabledMark: 1,
    label: '高加二班',
    id: '403034187151441984',
    creatorTime: 1638702548000
  },
  {
    enabledMark: 1,
    label: '高加三班',
    id: '403034187151441983',
    creatorTime: 1638702548000
  },
  {
    enabledMark: 1,
    label: '高加四班',
    id: '403034187151441982',
    creatorTime: 1638702548000
  }
]

const getShortBills = function() {
  return shortBills
}

const getLongBills = function() {
  return longBills
}

const getGroups = function() {
  return groups
}

module.exports = {
  getShortBills,
  getLongBills,
  getGroups
}
