<template>
  <div class="BL-common-layout">

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
        <BL-table ref="BLTable" v-loading="tableLoading" :data="tableData" row-key="id" default-expand-all>
          <template v-for="item in computedRoleColumnOptions">
            <template v-if="item.prop === 'action'">
              <ex-table-column v-if="hasRoleButton('btn_record')" :key="item.prop" :label="item.label" width="80" fixed="right">
                <template #default="scope">
                  <el-button v-if="hasRoleButton('btn_record') && !!scope.row.parentId" type="text" @click="showCheckRecords(scope.row.id)">检查记录</el-button>
                </template>
              </ex-table-column>
            </template>
            <template v-else-if="item.prop === 'shortBillCheckingStatus'">
              <ex-table-column :key="item.prop" :label="item.label">
                <template #default="scope">
                  <span v-if="!scope.row.parentId" />
                  <span v-else-if="!scope.row.hasOwnProperty('shortBillCheckingStatus')">-</span>
                  <el-tag v-else :type="getCheckingStatusStyle(scope.row.shortBillCheckingStatus)" disable-transitions>
                    {{ getCheckingStatusLabel(scope.row.shortBillCheckingStatus) }}
                  </el-tag>
                </template>
              </ex-table-column>
            </template>
            <template v-else-if="item.prop === 'shortBillCheckedStatus'">
              <ex-table-column :key="item.prop" :label="item.label">
                <template #default="scope">
                  <span v-if="!scope.row.parentId" />
                  <span v-else-if="!scope.row.hasOwnProperty('shortBillCheckedStatus')">-</span>
                  <el-tag v-else :type="getCheckedStatusStyle(scope.row.shortBillCheckedStatus)" disable-transitions>
                    {{ getCheckedStatusLabel(scope.row.shortBillCheckedStatus) }}
                  </el-tag>
                </template>
              </ex-table-column>
            </template>
            <template v-else-if="item.prop === 'longBillCheckingStatus'">
              <ex-table-column :key="item.prop" :label="item.label">
                <template #default="scope">
                  <span v-if="!scope.row.parentId" />
                  <span v-else-if="!scope.row.hasOwnProperty('longBillCheckingStatus')">-</span>
                  <el-tag v-else :type="getCheckingStatusStyle(scope.row.longBillCheckingStatus)" disable-transitions>
                    {{ getCheckingStatusLabel(scope.row.longBillCheckingStatus) }}
                  </el-tag>
                </template>
              </ex-table-column>
            </template>
            <template v-else-if="item.prop === 'longBillCheckedStatus'">
              <ex-table-column :key="item.prop" :label="item.label">
                <template #default="scope">
                  <span v-if="!scope.row.parentId" />
                  <span v-else-if="!scope.row.hasOwnProperty('longBillCheckedStatus')">-</span>
                  <el-tag v-else :type="getCheckedStatusStyle(scope.row.longBillCheckedStatus)" disable-transitions>
                    {{ getCheckedStatusLabel(scope.row.longBillCheckedStatus) }}
                  </el-tag>
                </template>
              </ex-table-column>
            </template>
            <template v-else>
              <ex-table-column :key="item.prop" :label="item.label" :prop="item.prop" />
            </template>
          </template>
        </BL-table>
      </div>
    </div>

    <CheckRecordsDrawer v-if="checkRecordsDrawerVisible" ref="CheckRecordsDrawer" :can-handle-abnormal="hasRoleButton('btn_abnormalHandle')" @close="closeDrawer" />
  </div>
</template>

<script>
import { getClassWithCheckStatus } from '@/api/bill/class'
import {
  getCheckingStatusStyle,
  getCheckingStatusLabel,
  getCheckedStatusStyle,
  getCheckedStatusLabel
} from '@/utils/helperHandlers'
import { dateFormatTable } from '@/utils'

import CheckRecordsDrawer from '../../components/checkRecordsDrawer'

const typeList = [
  {
    label: '短期盲板',
    value: 'shortBill'
  },
  {
    label: '长期盲板',
    value: 'longBill'
  }
]
export default {
  name: 'ClassCheckMb',

  components: {
    CheckRecordsDrawer
  },

  data() {
    return {
      tableLoading: false,
      tableData: [],
      params: {
        keyword: ''
      },
      checkRecordsDrawerVisible: false,
      roleButtonOptions: ['btn_record', 'btn_abnormalHandle'],
      roleColumnOptions: [
        {
          label: '名称',
          prop: 'fullName'
        },
        {
          label: 'C-短期',
          prop: 'shortBillCheckingStatus'
        },
        {
          label: 'H-短期',
          prop: 'shortBillCheckedStatus'
        },
        {
          label: 'C-长期',
          prop: 'longBillCheckingStatus'
        },
        {
          label: 'H-长期',
          prop: 'longBillCheckedStatus'
        },
        {
          label: '操作',
          prop: 'action'
        }
      ]
    }
  },

  computed: {
    computedRoleColumnOptions() {
      this.setPermissions()

      return this.roleColumnOptions
    }
  },

  created() {
    this.initData()
  },

  methods: {
    initData() {
      this.tableLoading = true
      getClassWithCheckStatus(this.params).then(res => {
        this.tableData = res.data.list
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },

    reset() {
      this.params.keyword = ''
      this.initData()
    },

    search() {
      this.initData()
    },

    showCheckRecords(id) {
      this.checkRecordsDrawerVisible = true
      this.$nextTick(() => {
        this.$refs.CheckRecordsDrawer.init(id, typeList)
      })
    },

    closeDrawer(isRefresh) {
      this.checkRecordsDrawerVisible = false

      if (isRefresh) this.initData()
    },

    setPermissions() {
      // Get the list with all the user permissions from the store.
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

    dateFormatTable,

    getCheckingStatusStyle,

    getCheckingStatusLabel,

    getCheckedStatusStyle,

    getCheckedStatusLabel
  }
}
</script>

<style>

</style>
