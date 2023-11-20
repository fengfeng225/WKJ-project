<template>
  <div class="BL-common-layout">
    <div class="BL-common-layout-center">
      <el-row class="BL-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input
                v-model="listQuery.keyword"
                placeholder="请输入关键词查询"
                clearable
                @keyup.enter.native="search()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">
                查询
              </el-button>
              <el-button icon="el-icon-refresh-right" @click="reset">
                重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="BL-common-layout-main BL-flex-main">
        <BL-table v-loading="listLoading" :data="list">
          <ex-table-column prop="category" label="类目" />
          <!-- <ex-table-column prop="entityCode" label="编码" /> -->
          <ex-table-column prop="runCount" label="下发次数" />
          <el-table-column
            prop="lastRunTime"
            label="最后下发时间"
            width="120"
            :formatter="dateFormatTable"
          />
          <el-table-column
            prop="nextRunTime"
            label="下次下发时间"
            width="120"
            :formatter="dateFormatTable"
          />
          <ex-table-column prop="description" label="说明" />
          <el-table-column label="状态" prop="enabledMark" width="70" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabledMark"
                :active-value="1"
                :inactive-value="0"
                disabled
                class="table-switch"
                @click.native="handleUpdateState(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
              <el-button class="BL-table-delBtn" type="text" @click="handleDel(scope.row.id)">删除</el-button>
              <BL-Dropdown style="margin-left: 8px;">
                <span>
                  <el-button type="text" size="small">更多<i class="el-icon-arrow-down el-icon--right" /></el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="viewLog(scope.row)">下发日志</el-dropdown-item>
                </el-dropdown-menu>
              </BL-Dropdown>
            </template>
          </el-table-column>
        </BL-table>

        <ConfigForm v-if="formVisible" ref="ConfigForm" @close="closeForm" />
        <Log v-if="logVisible" ref="Log" @close="logVisible = false" />
      </div>
    </div>
  </div>
</template>

<script>
import { checkPlanList, checkPlanDelete, checkPlanStop, checkPlanEnable } from '@/api/scheduledTask/checkPlan'
import { dateFormatTable } from '@/utils'

import ConfigForm from './configForm'
import Log from './Log'

export default {
  name: 'SystemTask',
  components: { ConfigForm, Log },
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        keyword: ''
      },
      logVisible: false,
      formVisible: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    search() {
      this.initData()
    },
    reset() {
      this.listQuery.keyword = ''
      this.search()
    },
    initData() {
      this.listLoading = true
      checkPlanList(this.listQuery).then(res => {
        this.list = res.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    handleDel(id) {
      this.$confirm('您确定要删除该条数据吗?', '提示', {
        type: 'warning'
      }).then(() => {
        checkPlanDelete(id).then(res => {
          this.$message({
            type: 'success',
            message: res.message,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },

    viewLog(row) {
      this.logVisible = true
      this.$nextTick(() => {
        this.$refs.Log.init(row.id, row.category)
      })
    },

    handleUpdateState(row) {
      const txt = row.enabledMark ? '停止' : '启用'
      this.$confirm(`您确定要${txt}该任务, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        const method = row.enabledMark ? checkPlanStop : checkPlanEnable
        method(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.message,
            duration: 1500,
            onClose: () => {
              row.enabledMark = row.enabledMark ? 0 : 1
            }
          })
        })
      }).catch(() => { })
    },
    // 修改
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.ConfigForm.init(id)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false

      if (isRefresh) {
        this.listQuery.keyword = ''
        this.initData()
      }
    },

    dateFormatTable
  }
}
</script>
