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
        <BL-table ref="BLTable" v-loading="tableLoading" :data="tableData" fixed-n-o row-key="id">
          <template v-for="item in columns">
            <template v-if="item.prop === 'name'">
              <ex-table-column :key="item.prop" :label="item.label">
                <template #default="scope">
                  {{ getDeviceName(scope.row.name) }}
                </template>
              </ex-table-column>
            </template>
            <template v-else-if="item.prop === 'remark'">
              <ex-table-column :key="item.prop" :label="item.label" :prop="item.prop">
                <template #default="scope">
                  {{ getRemarkStatus(scope.row.remark) }}
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
            <template v-else-if="item.prop === 'size'">
              <el-table-column :key="item.prop" :label="item.label" :prop="item.prop" width="75" />
            </template>
            <template v-else-if="item.prop === 'disassembleTime'">
              <ex-table-column :key="item.prop" :label="item.label" :prop="item.prop" :formatter="dateFormatTable" />
            </template>
            <template v-else-if="item.prop === 'cycleType'">
              <ex-table-column :key="item.prop" :label="item.label" :prop="item.prop" :formatter="getCycleTypeLabel" />
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
      </div>
    </div>
  </div>
</template>

<script>
import { getDisassembleDetails } from '@/api/bill/mb/bill'
import { getGroupCategories } from '@/api/bill/mb/group'
import { getOptionsByCode } from '@/api/systemData/dictionary'
import { getMBStatusStyle, getMBStatusLabel, getCycleTypeLabel } from '@/utils/helperHandlers'
import { dateFormatTable } from '@/utils'

export default {
  name: 'DisassembleDetail',
  data() {
    return {
      params: {
        groupId: null,
        keyword: '',
        currentPage: 1,
        pageSize: 20
      },
      total: 0,
      treeLoading: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableLoading: false,
      tableData: [],
      deviceNameList: [],
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
          label: '类型',
          prop: 'cycleType'
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
          label: '拆装操作',
          prop: 'remark'
        },
        {
          label: '拆装时间',
          prop: 'disassembleTime'
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
          label: '操作人员',
          prop: 'operator'
        },
        {
          label: '管理干部',
          prop: 'Manager'
        }
      ]
    }
  },

  computed: {
    columns() {
      return this.roleColumnOptions
    }
  },

  created() {
    getOptionsByCode('deviceName').then(res => {
      this.deviceNameList = res.data.list
    })
    this.getGroupList()
  },

  methods: {
    getGroupList() {
      this.treeLoading = true
      getGroupCategories().then(res => {
        const parent = [{
          label: '全部',
          hasChildren: true,
          id: -1,
          children: res.data.list
        }]
        this.treeData = parent

        this.$nextTick(() => {
          if (this.$refs.Tree) this.$refs.Tree.setCurrentKey(-1)
          this.treeLoading = false
          this.initData()
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },

    initData() {
      this.tableLoading = true
      getDisassembleDetails(this.params).then(res => {
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

    handleNodeClick(data) {
      if (this.params.groupId === data.id) return

      this.params.groupId = data.id
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

    getRemarkStatus(content) {
      if (content.includes('0')) return content.replace('0', '盲')
      if (content.includes('1')) return content.replace('1', '通')

      return content
    },

    getMBStatusStyle,

    getMBStatusLabel,

    getCycleTypeLabel,

    dateFormatTable
  }
}
</script>

<style>

</style>
