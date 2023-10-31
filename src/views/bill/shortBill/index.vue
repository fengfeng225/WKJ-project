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
                placeholder="请输入关键词"
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
            <el-button icon="el-icon-upload2" :loading="importLoading" @click="importData">导入</el-button>
            <el-button icon="el-icon-download" :loading="exportLoading" @click="exportData">导出</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">新建</el-button>
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
        <BL-table ref="BLTable" v-loading="tableLoading" :data="tableData" :cell-style="{padding: '0'}" fixed-n-o row-key="id" @filter-change="deviceNameFilter">
          <template v-for="item in columns">
            <template v-if="item.prop === 'action'">
              <ex-table-column :key="item.prop" :label="item.label" width="150" fixed="right">
                <template #default="scope">
                  <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
                  <el-button class="BL-table-delBtn" type="text" @click="removeHandle(scope.row.id)">删除</el-button>
                  <!-- <BL-Dropdown style="margin-left: 8px;">
                    <span>
                      <el-button type="text" size="small">更多<i class="el-icon-arrow-down el-icon--right" /></el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        测试
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </BL-Dropdown> -->
                </template>
              </ex-table-column>
            </template>
            <template v-else-if="item.prop === 'PipelineMedia'">
              <ex-table-column :key="item.prop" :label="item.label">
                <template v-for="column in item.children">
                  <ex-table-column :key="column.prop" :label="column.label" :prop="column.prop" :width="column.prop === 'pipelineMediaName' ? '100px' : 'auto'" />
                </template>
              </ex-table-column>
            </template>
            <template v-else-if="item.prop === 'status'">
              <ex-table-column :key="item.prop" :label="item.label" :prop="item.prop">
                <template #default="scope">
                  <el-tag :type="getMBStatusStyle(scope.row.status)">{{ getMBStatusLabel(scope.row.status) }}</el-tag>
                </template>
              </ex-table-column>
            </template>
            <template v-else-if="item.prop === 'name'">
              <ex-table-column :key="item.prop" :label="item.label" :prop="item.prop" :filters="deviceNameCategory" />
            </template>
            <template v-else-if="item.prop === 'installTime'">
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
      </div>
    </div>
  </div>
</template>

<script>
import { getShortBills, deleteShortBill } from '@/api/bill'
import { getDeviceNameCategory, getGroupCategories } from '@/api/billCategory'
import { getMBStatusStyle, getMBStatusLabel } from '@/utils/helperHandlers'
import { dateFormatTable } from '@/utils'

import BillForm from '../components/BillForm'

export default {
  name: 'ShortBill',
  components: {
    BillForm
  },
  data() {
    return {
      params: {
        groupId: '',
        keyword: '',
        currentPage: 1,
        pageSize: 20,
        queryJson: null
      },
      groupId: '',
      total: 100,
      treeLoading: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableLoading: false,
      tableData: [],
      deviceNameCategory: [],
      importLoading: false,
      exportLoading: false,
      roleButtonOptions: [],
      roleColumnOptions: [
        {
          label: '装置名称',
          prop: 'name'
        },
        {
          label: '盲板编号',
          prop: 'code'
        },
        {
          label: '管径',
          prop: 'pipDiameter'
        },
        {
          label: '盲板安装位置描述',
          prop: 'description'
        },
        {
          label: '盲通状态',
          prop: 'status'
        },
        {
          label: '管线介质',
          prop: 'PipelineMedia',
          children: [
            {
              label: '名称',
              prop: 'pipelineMediaName'
            },
            {
              label: '温度 (℃)',
              prop: 'pipelineMediaTemperature'
            },
            {
              label: '压力 (MPa)',
              prop: 'pipelineMediaPressure'
            }
          ]
        },
        {
          label: '盲板规格 (mm)',
          prop: 'size'
        },
        {
          label: '盲板形式',
          prop: 'type'
        },
        {
          label: '盲板材质',
          prop: 'material'
        },
        {
          label: '加装时间',
          prop: 'installTime'
        },
        // {
        //   label: '界区系统/装置内部',
        //   prop: 'material'
        // },
        {
          label: '操作人员',
          prop: 'operators'
        },
        {
          label: '管理干部',
          prop: 'Manager'
        },
        {
          label: '操作',
          prop: 'action'
        }
      ],
      billFormVisible: false
    }
  },

  computed: {
    columns() {
      return this.roleColumnOptions
    }
  },

  created() {
    this.getGroupList()
    this.getDeviceNameCategory()
  },

  methods: {
    getGroupList() {
      this.treeLoading = true
      getGroupCategories().then(res => {
        this.treeData = res.data

        if (!this.treeData.length) {
          this.treeLoading = false
          return
        }

        this.$nextTick(() => {
          this.groupId = this.treeData[0].id
          if (this.$refs.Tree) this.$refs.Tree.setCurrentKey(this.groupId)
          this.treeLoading = false
          this.initData()
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },

    getDeviceNameCategory() {
      getDeviceNameCategory().then(res => {
        this.deviceNameCategory = res.data.map(item => {
          return {
            text: item,
            value: item
          }
        })
      }).catch(() => {})
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
      getShortBills(this.params).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.pagination.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
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

    importData() {},

    exportData() {},

    handleNodeClick(data) {
      if (this.params.groupId === data.id) return

      this.params.groupId = data.id
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
      this.$confirm('您确定要删除该盲板吗?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteShortBill(id).then(res => {
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

    getMBStatusStyle,

    getMBStatusLabel,

    dateFormatTable
  }
}
</script>

<style>

</style>
