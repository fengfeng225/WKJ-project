<template>
  <div class="BL-common-layout systemLogs">
    <div class="BL-common-layout-center BL-flex-main">
      <el-row class="BL-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input
                v-model="params.keyword"
                placeholder="请输入关键词"
                clearable
                @keyup.enter.native="search()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="时间">
              <el-date-picker
                v-model="pickerVal"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="timestamp"
                clearable
                :editable="false"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">
                查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="BL-common-layout-main">
        <el-tabs
          v-model="activeName"
          type="border-card"
          class="logTabs"
          :before-leave="beforeLeaveTabPane"
        >
          <div class="BL-common-head">
            <div class="left-btn">
              <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDel">
                删除
              </el-button>
            </div>
            <div class="BL-common-head-right">
              <el-tooltip effect="dark" content="刷新" placement="top">
                <el-link
                  icon="icon-ym icon-ym-Refresh BL-common-head-icon"
                  :underline="false"
                  @click="reset"
                />
              </el-tooltip>
            </div>
          </div>
          <el-tab-pane label="登录日志" name="1">
            <BL-table
              v-loading="listLoading"
              :data="loginLogData"
              has-c
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                prop="creatorTime"
                :formatter="dateFormatTable"
                label="登录时间"
                width="150"
              />
              <el-table-column prop="userName" label="登录用户" width="120" />
              <el-table-column prop="IPAddress" label="登录IP" width="120" />
              <el-table-column prop="userAgent" label="登录摘要" show-overflow-tooltip />
            </BL-table>
          </el-tab-pane>
          <el-tab-pane label="请求日志" name="2">
            <BL-table
              v-loading="listLoading"
              :data="requestLogData"
              has-c
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                prop="creatorTime"
                :formatter="dateFormatTable"
                label="请求时间"
                width="150"
              />
              <el-table-column prop="userName" label="请求用户" width="120" />
              <el-table-column prop="IPAddress" label="请求IP" width="120" />
              <el-table-column prop="requestMethod" label="请求类型" width="120" />
              <el-table-column prop="requestURL" label="请求地址" show-overflow-tooltip />
              <el-table-column prop="userAgent" label="请求设备" show-overflow-tooltip />
            </BL-table>
          </el-tab-pane>
          <el-tab-pane label="异常日志" name="3">
            <BL-table
              v-loading="listLoading"
              :data="errorLogData"
              has-c
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                prop="creatorTime"
                :formatter="dateFormatTable"
                label="创建时间"
                width="150"
              />
              <el-table-column prop="userName" label="创建用户" width="120" />
              <el-table-column prop="IPAddress" label="异常IP" width="120" />
              <el-table-column prop="errorMessage" label="异常描述">
                <template slot-scope="scope">
                  <el-link style="font-size:12px" @click="goDetail(scope.row.errorMessage)">
                    <p class="line1">{{ scope.row.errorMessage }}</p>
                  </el-link>
                </template>
              </el-table-column>
            </BL-table>
          </el-tab-pane>
          <BL-pagination
            :total="total"
            :page.sync="params.currentPage"
            :limit.sync="params.pageSize"
            @pagination="initData()"
          />
        </el-tabs>
      </div>
    </div>
    <Form v-show="formVisible" ref="Form" @close="formVisible=false" />
  </div>
</template>

<script>
import { getLogList, delLog } from '@/api/system/log'
import { dateFormatTable } from '@/utils'

import Form from './Form'

export default {
  name: 'SystemLog',
  components: { Form },
  data() {
    return {
      formVisible: false,
      listLoading: false,
      activeName: '1',
      loginLogData: [],
      errorLogData: [],
      requestLogData: [],
      multipleSelection: [],
      total: 0,
      params: {
        keyword: '',
        startTime: '',
        endTime: '',
        currentPage: 1,
        pageSize: 20
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      pickerVal: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData(activeName) {
      const activeId = activeName || this.activeName
      this.listLoading = true
      getLogList(activeId, this.params).then(res => {
        if (activeId === '1') this.loginLogData = res.data.list
        if (activeId === '2') this.requestLogData = res.data.list
        if (activeId === '3') this.errorLogData = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    beforeLeaveTabPane(activeName) {
      this.reset(activeName)
    },
    goDetail(data) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(data)
      })
    },
    handleSelectionChange(val) {
      const res = val.map(item => item.id)
      this.multipleSelection = res
    },
    handleDel() {
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '请选择一条数据',
          duration: 1500
        })
        return
      }
      const data = {
        ids: this.multipleSelection
      }
      this.$confirm('您确定要删除这些数据吗, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        delLog(data).then(res => {
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
    search() {
      if (this.pickerVal && this.pickerVal.length) {
        this.params.startTime = this.pickerVal[0]
        this.params.endTime = this.pickerVal[1]
      } else {
        this.params.startTime = ''
        this.params.endTime = ''
      }
      this.params.currentPage = 1
      this.params.pageSize = 20
      this.params.sort = 'desc'
      this.initData()
    },
    reset(activeName) {
      this.pickerVal = []
      this.params.keyword = ''
      this.params.startTime = ''
      this.params.endTime = ''
      this.params.currentPage = 1
      this.params.pageSize = 20
      this.params.sort = 'desc'
      this.initData(activeName)
    },
    dateFormatTable
  }
}
</script>

<style lang="scss" scoped>
  .systemLogs {
    .BL-common-layout-main {
      padding: 0;
    }

    .logTabs {
      height: 100%;
    }

    .line1 {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }

    ::v-deep .el-tabs__content {
      height: calc(100% - 40px);
      padding: 0;

      .el-tab-pane {
        height: calc(100% - 80px);
        overflow: hidden;
      }
    }
  }
</style>
