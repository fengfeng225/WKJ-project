// ！！！！ 查询需要查找未被删除的和已启用的 ！！！！
// ！！！！ 新增需要添加创建时间/创建用户， 修改需要添加修改时间/修改用户 ！！！！
// 新增需要查重
// 更新需要查重
// 有外键的禁止删除
// id禁止更新
// user role menu button column 分别一张表
// user - role 一张关系表， role - (menu button column)  一张关系表

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

// 表
const menuList = [
  {
    'enabledMark': 1,
    'fullName': '代码生成',
    'icon': 'icon-ym icon-ym-codeGeneration',
    'urlAddress': '',
    'type': 1,
    'sortCode': 2,
    'id': '76975bee62074937b8e3ab76e53b0797',
    'parentId': '-1'
  },
  {
    'enabledMark': 1,
    'fullName': '功能表单',
    'icon': 'icon-ym icon-ym-webForm',
    'urlAddress': 'generator/webForm',
    'type': 2,
    'sortCode': 15,
    'id': 'f32e517a0a9e4cf7b2eb80a589a6da9d',
    'parentId': '76975bee62074937b8e3ab76e53b0797'
  },
  {
    'enabledMark': 1,
    'fullName': '移动表单',
    'icon': 'icon-ym icon-ym-appForm',
    'urlAddress': 'generator/appForm',
    'type': 2,
    'sortCode': 16,
    'id': 'aad12c217ea047e0814c631c4784f489',
    'parentId': '76975bee62074937b8e3ab76e53b0797'
  },
  {
    'enabledMark': 1,
    'fullName': '流程表单',
    'icon': 'icon-ym icon-ym-flowForm',
    'urlAddress': 'generator/flowForm',
    'type': 2,
    'sortCode': 17,
    'id': '8ee6ec6db2ac4a5e9b010100c7690798',
    'parentId': '76975bee62074937b8e3ab76e53b0797'
  }
]

// 表
const buttons = [
  {
    'fullName': 'Add',
    'entityCode': 'btn_add',
    'enabledMark': 1,
    'sortCode': 0,
    'id': '398656638363369541',
    'moduleId': 'f32e517a0a9e4cf7b2eb80a589a6da9d' // menuId
  },
  {
    'fullName': 'Edit',
    'entityCode': 'btn_edit',
    'enabledMark': 1,
    'sortCode': 0,
    'id': '398672252515647557',
    'moduleId': 'f32e517a0a9e4cf7b2eb80a589a6da9d'
  },
  {
    'fullName': 'Add',
    'entityCode': 'btn_add',
    'enabledMark': 1,
    'sortCode': 0,
    'id': '398656638363369542',
    'moduleId': '8ee6ec6db2ac4a5e9b010100c7690798'
  }
]

// 表
const columns = [
  {
    'id': '398677119342739526',
    'entityCode': 'targetName',
    'fullName': 'Target Name',
    'enabledMark': 1,
    'sortCode': null,
    'moduleId': 'f32e517a0a9e4cf7b2eb80a589a6da9d' // menuId
  },
  {
    'id': '398677119342739527',
    'entityCode': 'ipAddress',
    'fullName': 'IP Address',
    'enabledMark': 1,
    'sortCode': null,
    'moduleId': 'f32e517a0a9e4cf7b2eb80a589a6da9d'
  },
  {
    'id': '398677119342739528',
    'entityCode': 'targetType',
    'fullName': 'Target Type',
    'enabledMark': 1,
    'sortCode': null,
    'moduleId': 'f32e517a0a9e4cf7b2eb80a589a6da9d'
  },
  {
    'id': '398677119342739529',
    'entityCode': 'remarkJson',
    'fullName': 'Remark',
    'enabledMark': 1,
    'sortCode': null,
    'moduleId': 'f32e517a0a9e4cf7b2eb80a589a6da9d'
  }
]

const roleList = [
  {
    'fullName': '热线客服',
    'entityCode': 'CustomService',
    'description': null,
    'enabledMark': 1,
    'creatorTime': 1509072066000,
    'sortCode': 0,
    'id': '9ad2e5556a6943a88a009a5f3fc8c3f4'
  },
  {
    'fullName': '总经理',
    'entityCode': 'General',
    'description': null,
    'enabledMark': 1,
    'creatorTime': 1509071979000,
    'sortCode': 0,
    'id': 'd2b2418a2f664c61abf0053ff5d57783'
  },
  {
    'fullName': '开发人员',
    'entityCode': 'Developer',
    'description': null,
    'enabledMark': 1,
    'creatorTime': 1509072045000,
    'sortCode': 0,
    'id': 'e55532c906b348798b078ea0c17dbbb1'
  }
]

const roleRelation = [
  {
    id: '410662596048322600',
    itemType: 'menu',
    itemId: '76975bee62074937b8e3ab76e53b0797',
    roleId: 'e55532c906b348798b078ea0c17dbbb1',
    creatorTime: 1509075545000
  },
  {
    id: '410662596048322629',
    itemType: 'menu',
    itemId: 'f32e517a0a9e4cf7b2eb80a589a6da9d',
    roleId: 'e55532c906b348798b078ea0c17dbbb1',
    creatorTime: 1509075545000
  },
  {
    id: '410662596048322640',
    itemType: 'button',
    itemId: '398656638363369541',
    roleId: 'e55532c906b348798b078ea0c17dbbb1',
    creatorTime: 1509075545000
  },
  {
    id: '410662596048322629',
    itemType: 'column',
    itemId: '398677119342739527',
    roleId: 'e55532c906b348798b078ea0c17dbbb1',
    creatorTime: 1509075545000
  }
]

const userRelation = [
  {
    id: '441100315089961029',
    userId: '',
    roleId: 'e55532c906b348798b078ea0c17dbbb1',
    sortCode: 0,
    creatorTime: 1509075545000
  }
]

const users = [
  {
    'id': '398311385311739973',
    'account': 'byyb',
    'password': '',
    'realName': '白油一班',
    'token': 'byyb-token',
    'roles': ['byyb'],
    'enabledMark': 1,
    'creatorTime': 1677130037000,
    'sortCode': 0
  },
  {
    'id': 'admin',
    'account': 'admin',
    'password': 'e10adc3949ba59abbe56e057f20f883e',
    'realName': '管理员',
    'token': 'admin-token',
    'roles': ['admin'],
    'enabledMark': 1,
    'creatorTime': 1509092175000,
    'sortCode': 0
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

const getMenuList = function() {
  return menuList
}

const getButtons = function() {
  return buttons
}

const getColumns = function() {
  return columns
}

const getRoleList = function() {
  return roleList
}

const getRoleRelation = function() {
  return roleRelation
}

const getUserRelation = function() {
  return userRelation
}

const getUsers = function() {
  return users
}

module.exports = {
  getShortBills,
  getLongBills,
  getGroups,
  getDictionaryList,
  getOptions,
  getMenuList,
  getButtons,
  getColumns,
  getRoleList,
  getRoleRelation,
  getUserRelation,
  getUsers
}
