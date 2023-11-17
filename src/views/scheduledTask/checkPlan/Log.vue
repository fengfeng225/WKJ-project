<template>
  <transition name="el-zoom-in-center">
    <div class="HG-preview-main">
      <div class="HG-common-page-header">
        <el-page-header :content="title" @back="goBack" />
        <div class="options">
          <el-button @click="goBack()">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">
        <el-row class="HG-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item :label="$t('system.executionTime')">
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
              <el-form-item :label="$t('system.executionResults')">
                <el-select v-model="listQuery.runResult" :placeholder="$t('system.executionResultsHint')" clearable>
                  <el-option :label="$t('system.resultSuccess')" :value="0" />
                  <el-option :label="$t('system.resultFailed')" :value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}
                </el-button>
                <el-button icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <HG-table v-loading="listLoading" :data="list">
          <el-table-column
            prop="runTime"
            :label="$t('system.executionTime')"
            :formatter="hg.tableDateFormat"
            width="130"
          />
          <el-table-column prop="runResult" :label="$t('system.executionResults')" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.runResult == 0 ? 'success' : 'danger'">
                {{ scope.row.runResult == 0 ? $t('system.resultSuccess') : $t('system.resultFailed') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" :label="$t('system.executionInstructions')" />
        </HG-table>
        <pagination
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
import { TimeTaskTaskLogList } from '@/api/system/timeTask'
import { deepClone } from '@/utils'
const listQuery = {
  runResult: '',
  startTime: '',
  endTime: '',
  currentPage: 1,
  pageSize: 20,
  sort: 'desc',
  sidx: ''
}
export default {
  data() {
    return {
      id: '',
      title: '',
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {},
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
    init(id, title) {
      if (!id) return this.$emit('close')
      this.id = id
      this.title = title
      this.reset()
    },
    initData() {
      this.listLoading = true
      TimeTaskTaskLogList(this.id, this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    reset() {
      this.pickerVal = []
      this.listQuery = deepClone(listQuery)
      this.initData()
    },
    search() {
      const runResult = this.listQuery.runResult
      this.listQuery = deepClone(listQuery)
      this.listQuery.runResult = runResult
      if (this.pickerVal && this.pickerVal.length) {
        this.listQuery.startTime = this.pickerVal[0]
        this.listQuery.endTime = this.pickerVal[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      this.initData()
    }
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
