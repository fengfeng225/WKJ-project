<template>
  <div class="BL-common-layout">
    <!-- left -->
    <div class="BL-common-layout-left">
      <div class="BL-common-title">
        <h2>班组</h2>
      </div>
      <el-scrollbar
        v-loading="treeLoading"
        class="BL-common-el-tree-scrollbar"
      >
        <el-tree
          ref="Tree"
          :data="treeData"
          :props="defaultProps"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          node-key="id"
          class="BL-common-el-tree"
          @node-click="handleNodeClick"
        />
      </el-scrollbar>
    </div>
    <!-- right -->
    <div class="BL-common-layout-center BL-flex-main">
      <el-row class="BL-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <input
                v-model.lazy="params.keyword"
                class="el-textarea__inner"
                placeholder="请输入关键词查询"
                clearable
                @keyup.enter="search"
              >
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>

        <div class="BL-common-head-right">
          <div>
            <el-button v-if="hasRoleButton('btn_check')" @click="showCheckDialog">一键检查</el-button>
            <el-button v-if="hasRoleButton('btn_export')" icon="el-icon-download" :loading="exportLoading" @click="exportData">导出</el-button>
            <el-button v-if="hasRoleButton('btn_add')" icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">新建</el-button>
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link
                style="margin-left: 12px;"
                icon="el-icon-refresh"
                :underline="false"
                @click="reset"
              />
            </el-tooltip>
          </div>
        </div>
      </el-row>

      <div class="BL-common-layout-main BL-flex-main">
        <BL-table ref="BLTable" v-loading="tableLoading" :data="tableData" fixed-n-o row-key="id" @filter-change="deviceNameFilter">
          <template v-for="item in computedRoleColumnOptions">
            <template v-if="item.prop === 'action'">
              <ex-table-column v-if="hasRoleButton(['btn_edit', 'btn_delete'])" :key="item.prop" :label="item.label" width="100" fixed="right">
                <template #default="scope">
                  <el-button v-if="hasRoleButton('btn_edit')" type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
                  <el-button v-if="hasRoleButton('btn_delete')" class="BL-table-delBtn" type="text" @click="removeHandle(scope.row.id)">删除</el-button>
                  <!-- <BL-Dropdown style="margin-left: 8px;">
                    <span>
                      <el-button type="text" size="small">更多<i class="el-icon-arrow-down el-icon--right" /></el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>其他</el-dropdown-item>
                    </el-dropdown-menu>
                  </BL-Dropdown> -->
                </template>
              </ex-table-column>
            </template>
            <template v-else-if="item.prop === 'name'">
              <ex-table-column :key="item.prop" :label="item.label" :filters="deviceNameListForFilter">
                <template #default="scope">
                  {{ getDeviceName(scope.row.name) }}
                </template>
              </ex-table-column>
            </template>
            <template v-else-if="item.prop === 'description'">
              <el-table-column :key="item.prop" :label="item.label" :prop="item.prop" width="300" show-overflow-tooltip />
            </template>
            <template v-else-if="item.prop === 'riskAnalysis'">
              <el-table-column :key="item.prop" :label="item.label" :prop="item.prop" width="300" show-overflow-tooltip />
            </template>
            <template v-else-if="item.prop === 'measures'">
              <el-table-column :key="item.prop" :label="item.label" :prop="item.prop" width="300" show-overflow-tooltip />
            </template>
            <template v-else-if="item.prop === 'creatorTime'">
              <ex-table-column :key="item.prop" :label="item.label" :prop="item.prop" :formatter="dateFormatTable" />
            </template>
            <template v-else>
              <ex-table-column :key="item.prop" :label="item.label" :prop="item.prop" />
            </template>
          </template>
        </BL-table>
        <BL-pagination
          :page.sync="params.currentPage"
          :limit.sync="params.pageSize"
          :total="total"
          @pagination="initData"
        />

        <BillForm v-if="billFormVisible" ref="BillForm" @close="closeForm" />
        <CheckDialog v-if="checkDialogVisible" ref="CheckDialog" :role-class-list="roleClassList" @close="checkDialogVisible = false" />
      </div>
    </div>
  </div>
</template>

<script>
import { getAllKeyPointBills, getKeyPointBills, deleteKeyPointBill } from '@/api/bill/mutualChannelingPoints/keyPoint'
import { getClassSelector } from '@/api/bill/class'
import { getOptionsByCode } from '@/api/systemData/dictionary'
import { dateFormatTable, transToTDArray } from '@/utils'

import BillForm from './BillForm'
import CheckDialog from '../../components/checkDialog'

export default {
  name: 'KeyPointBill',
  components: {
    BillForm,
    CheckDialog
  },
  data() {
    return {
      params: {
        classId: '',
        keyword: '',
        currentPage: 1,
        pageSize: 20,
        queryJson: ''
      },
      total: 0,
      treeLoading: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      tableLoading: false,
      tableData: [],
      deviceNameList: [],
      deviceNameListForFilter: [],
      exportLoading: false,
      roleClassList: [],
      roleButtonOptions: ['btn_add', 'btn_edit', 'btn_export', 'btn_delete', 'btn_check'],
      roleColumnOptions: [
        {
          label: '装置名称',
          prop: 'name'
        },
        {
          label: '高压窜低压部位',
          prop: 'position'
        },
        {
          label: '现状描述',
          prop: 'description'
        },
        {
          label: '存在问题及风险分析',
          prop: 'riskAnalysis'
        },
        {
          label: '现有或临时防窜措施',
          prop: 'measures'
        },
        {
          label: '创建时间',
          prop: 'creatorTime'
        },
        {
          label: '操作',
          prop: 'action'
        }
      ],
      billFormVisible: false,
      checkDialogVisible: false
    }
  },

  computed: {
    computedRoleColumnOptions() {
      this.setPermissions()

      return this.roleColumnOptions
    }
  },

  created() {
    this.getDeviceNameList()
    this.getClassSelector()
  },

  methods: {
    getClassSelector() {
      this.treeLoading = true
      getClassSelector().then(res => {
        const parent = [{
          fullName: '全部',
          hasChildren: true,
          id: '-1',
          children: res.data.list
        }]
        this.treeData = parent

        this.$nextTick(() => {
          if (this.$refs.Tree) this.$refs.Tree.setCurrentKey('-1')
          this.treeLoading = false
          this.initData()
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },

    deviceNameFilter(filters) {
      const filterValues = Object.values(filters)[0]
      if (filterValues.length === 0) {
        this.params.queryJson = null
      } else {
        this.params.queryJson = JSON.stringify(filterValues)
      }
      this.initData()
    },

    initData() {
      this.tableLoading = true
      getKeyPointBills(this.params).then(res => {
        this.tableData = res.data.list
        this.total = res.data.pagination.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },

    getDeviceNameList() {
      getOptionsByCode('deviceName').then(res => {
        this.deviceNameList = res.data.list
        this.deviceNameListForFilter = res.data.list.map(item => {
          return {
            text: item.fullName,
            value: item.entityCode
          }
        })
      }).catch(() => {})
    },

    search() {
      this.params.currentPage = 1
      this.params.pageSize = 20
      this.initData()
    },

    reset() {
      this.params.keyword = ''
      this.params.currentPage = 1
      this.params.pageSize = 20
      this.initData()
    },

    getDeviceName(code) {
      if (this.deviceNameList) {
        const res = this.deviceNameList.find(x => x.entityCode === code)
        if (res) {
          return res.fullName
        }
      }

      return ''
    },

    async exportData() {
      this.exportLoading = true

      // 定义表头对应关系
      const headers = {
        '班组': 'classId',
        '装置名称': 'name',
        '高压窜低压部位': 'position',
        '现状描述': 'description',
        '存在问题及风险分析': 'riskAnalysis',
        '现有或临时防窜措施': 'measures'
      }

      try {
        const { data } = await getClassSelector()
        const classes = {}
        data.list.forEach(item => {
          classes[item.id] = item.fullName
        })

        import('@/vendor/Export2Excel').then(async excel => {
          const { data: { list }} = await getAllKeyPointBills()
          list.forEach(row => {
            row.classId = classes[row.classId]
          })

          const data = transToTDArray(headers, list)
          excel.export_json_to_excel({
            header: Object.keys(headers),
            data,
            filename: '关键点互窜台账',
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.exportLoading = false
        })
      } catch (error) {
        this.exportLoading = false
      }
    },

    showCheckDialog() {
      this.checkDialogVisible = true
      this.$nextTick(() => {
        this.$refs.CheckDialog.init('keyPoint')
      })
    },

    handleNodeClick(data) {
      if (this.params.classId === data.id) return

      this.params.classId = data.id
      this.initData()
    },

    closeForm(isRefresh) {
      this.billFormVisible = false

      if (isRefresh) this.initData()
    },

    addOrUpdateHandle(id) {
      this.billFormVisible = true
      this.$nextTick(() => {
        this.$refs.BillForm.init(id)
      })
    },

    removeHandle(id) {
      this.$confirm('您确定要删除该条数据吗?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteKeyPointBill(id).then(res => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },

    setPermissions() {
      // Get the list with all the user permissions from the store.
      this.roleClassList = this.$store.getters.classList
      const permissionList = this.$store.getters.permissionList

      // Retrieve the model ID based from the route.
      const menuId = this.$route.meta.menuId

      // Filter the user permission with the model and get only permissions for this page.
      const list = permissionList.filter(o => o.id === menuId)

      // Get the permissions for this module and check for column permissions.
      const columnList = list[0] && list[0].columns ? list[0].columns : []

      const permissionColumnList = []

      for (let i = 0; i < this.roleColumnOptions.length; i++) {
        // Create an inner look and assign a name to the loop.
        for (let j = 0; j < columnList.length; j++) {
          // If the column name in the page is in the list with user permissions add it to the visible list.
          if (this.roleColumnOptions[i].prop === columnList[j].entityCode) {
            permissionColumnList.push(this.roleColumnOptions[i])

            // We have found a match, break the inner loop and go to the outer loop for next item.
            break
          }
        }
      }

      // Assign the columns for this page with the filtered columns for the current user.
      this.roleColumnOptions = permissionColumnList

      // Get the permissions for this module and check for button permissions.
      const buttonList = list[0] && list[0].buttons ? list[0].buttons : []

      const permissionButtonList = []

      for (let i = 0; i < this.roleButtonOptions.length; i++) {
        for (let j = 0; j < buttonList.length; j++) {
          if (this.roleButtonOptions[i] === buttonList[j].entityCode) {
            permissionButtonList.push(this.roleButtonOptions[i])
            break
          }
        }
      }

      this.roleButtonOptions = permissionButtonList
    },

    hasRoleButton(code) {
      if (Array.isArray(code)) {
        for (const item of code) {
          if (this.roleButtonOptions.indexOf(item) > -1) {
            return true
          }
        }

        return false
      } else {
        return this.roleButtonOptions.indexOf(code) > -1
      }
    },

    dateFormatTable
  }
}
</script>

<style>

</style>
