<template>
  <div class="HG-common-layout systemLogs">
    <div class="HG-common-layout-center">
      <el-row class="HG-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item :label="$t('common.keyWord')">
              <el-input
                v-model="params.keyword"
                :placeholder="$t('common.enterKeyword')"
                clearable
                @keyup.enter.native="search()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('system.time')">
              <el-date-picker
                v-model="pickerVal"
                type="daterange"
                :start-placeholder="$t('system.startDate')"
                :end-placeholder="$t('system.endDate')"
                :picker-options="pickerOptions"
                value-format="timestamp"
                clearable
                :editable="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="HG-common-layout-main HG-flex-main">
        <el-tabs
          v-model="activeName"
          type="border-card"
          class="logTabs"
          @tab-click="handleTabClick"
        >
          <div class="HG-common-head">
            <div class="left-btn">
              <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDel">
                {{ $t('common.delete') }}
              </el-button>
            </div>
            <div class="HG-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link
                  icon="icon-ym icon-ym-Refresh HG-common-head-icon"
                  :underline="false"
                  @click="reset()"
                />
              </el-tooltip>
            </div>
          </div>
          <el-tab-pane :label="$t('system.loginLogs')" name="1">
            <HG-table
              v-loading="listLoading"
              :data="loginLogData"
              has-c
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                prop="creatorTime"
                :formatter="hg.tableDateFormat"
                :label="$t('system.loginTime')"
                width="120"
              />
              <el-table-column prop="userName" :label="$t('system.loginUserName')" width="120" />
              <el-table-column prop="ipaddress" :label="$t('system.loginIP')" width="120" />
              <el-table-column prop="platForm" :label="$t('system.loginAgent')" show-overflow-tooltip />
            </HG-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('system.requestLogs')" name="5">
            <HG-table
              v-loading="listLoading"
              :data="requestLogData"
              has-c
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                prop="creatorTime"
                :formatter="hg.tableDateFormat"
                :label="$t('system.requestTime')"
                width="120"
              />
              <el-table-column prop="userName" :label="$t('system.requestUserName')" width="120" />
              <el-table-column prop="ipaddress" :label="$t('system.requestIp')" width="120" />
              <el-table-column prop="platForm" :label="$t('system.requestAgent')" width="120" show-overflow-tooltip />
              <el-table-column prop="requestURL" :label="$t('system.requestUrl')" show-overflow-tooltip />
              <el-table-column prop="requestMethod" :label="$t('system.requestMethod')" width="120" />
              <el-table-column prop="requestDuration" :label="$t('system.requestDuration')" width="120" />
            </HG-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('system.exceptionLogs')" name="4">
            <HG-table
              v-loading="listLoading"
              :data="errorLogData"
              has-c
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                prop="creatorTime"
                :formatter="hg.tableDateFormat"
                :label="$t('system.creationTime')"
                width="120"
              />
              <el-table-column prop="userName" :label="$t('system.creationUser')" width="120" />
              <el-table-column prop="ipaddress" :label="$t('system.abnormalIp')" width="120" />
              <el-table-column prop="moduleName" :label="$t('system.abnormalFunctionality')" width="120" />
              <el-table-column prop="json" :label="$t('system.exceptionDescription')">
                <template slot-scope="scope">
                  <el-link style="font-size:12px" @click="goDetail(scope.row.json)">
                    <p class="line1">{{ scope.row.json }}</p>
                  </el-link>
                </template>
              </el-table-column>
            </HG-table>
          </el-tab-pane>
          <pagination
            :total="total"
            :page.sync="params.currentPage"
            :limit.sync="params.pageSize"
            @pagination="initData"
          />
        </el-tabs>
      </div>
    </div>
    <Form v-show="formVisible" ref="Form" @close="formVisible=false" />
  </div>
</template>

<script>
import { getLogList, delLog } from '@/api/system/log'
import Form from './Form'
export default {
  name: 'SystemLog',
  components: { Form },
  data() {
    return {
      formVisible: false,
      listLoading: true,
      startTime: '',
      endTime: '',
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
    initData() {
      const activeId = this.activeName
      this.listLoading = true
      getLogList(activeId, this.params).then(res => {
        if (activeId === '1') this.loginLogData = res.data.list
        if (activeId === '5') this.requestLogData = res.data.list
        if (activeId === '4') this.errorLogData = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleTabClick() {
      this.reset()
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
            message: res.msg,
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
    reset() {
      this.pickerVal = []
      this.params.keyword = ''
      this.params.startTime = ''
      this.params.endTime = ''
      this.params.currentPage = 1
      this.params.pageSize = 20
      this.params.sort = 'desc'
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
  .systemLogs {
    .HG-common-layout-main {
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

    :deep(.el-tabs__content) {
      height: calc(100% - 40px);
      padding: 0;

      .el-tab-pane {
        height: calc(100% - 110px);
        overflow: hidden;
      }
    }
  }
</style>
