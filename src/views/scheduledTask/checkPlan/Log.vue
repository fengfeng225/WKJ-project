<template>
  <transition name="el-zoom-in-center">
    <div class="BL-preview-main">
      <div class="BL-common-page-header">
        <el-page-header :content="fullName" @back="goBack" />
        <div class="options">
          <el-button @click="goBack">取消</el-button>
        </div>
      </div>
      <div class="main">
        <el-row class="BL-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="下发时间">
                <el-date-picker
                  v-model="pickerVal"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  value-format="timestamp"
                  clearable
                  :editable="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="下发结果">
                <el-select v-model="listQuery.runResult" placeholder="请选择下发结果" clearable>
                  <el-option label="成功" :value="1" />
                  <el-option label="失败" :value="0" />
                </el-select>
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
        <BL-table v-loading="listLoading" :data="list">
          <el-table-column
            prop="creatorTime"
            label="下发时间"
            :formatter="dateFormatTable"
            width="150"
          />
          <el-table-column prop="runResult" label="下发结果" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.runResult === 1 ? 'success' : 'danger'">
                {{ scope.row.runResult === 1 ? '成功' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="说明" />
        </BL-table>
        <BL-pagination
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { getCheckPlanLog } from '@/api/scheduledTask/billCheck'
import { dateFormatTable } from '@/utils'

export default {
  data() {
    return {
      id: '',
      fullName: '',
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        runResult: null,
        startTime: '',
        endTime: '',
        currentPage: 1,
        pageSize: 20
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      pickerVal: []
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },

    init(id, fullName) {
      this.id = id
      this.fullName = fullName
      this.initData()
    },

    initData() {
      this.listLoading = true
      getCheckPlanLog(this.id, this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    reset() {
      this.pickerVal = []
      this.listQuery.startTime = ''
      this.listQuery.endTime = ''
      this.listQuery.runResult = null
      this.initData()
    },

    search() {
      if (this.pickerVal.length > 0) {
        this.listQuery.startTime = this.pickerVal[0]
        this.listQuery.endTime = this.pickerVal[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      this.initData()
    },

    dateFormatTable
  }
}
</script>
<style lang="scss" scoped>
  .main {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 0 0 10px;

    :deep(.el-table) {
      flex: 1;
      border-top: none;
    }
  }
</style>
