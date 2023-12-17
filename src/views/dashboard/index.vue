<template>
  <div class="BL-common-layout">
    <div class="card-box-left">
      <el-card class="top-card">
        <div class="title">
          <p>管理规定</p>
        </div>
        <div class="management-rules">
          <div class="rule">
            <span class="text-left">公告</span>
            <el-divider direction="vertical" />
            <el-link type="primary" @click="showContent(1)">炼油第三联合车间防互窜管理规定</el-link>
          </div>
          <div class="rule">
            <span class="text-left">公告</span>
            <el-divider direction="vertical" />
            <el-link type="primary" @click="showContent(2)">关于修订印发《中石油克拉玛依石化有限责任公司盲板、放空阀封堵管理办法》的通知</el-link>
          </div>
          <div class="rule">
            <span class="text-left">公告</span>
            <el-divider direction="vertical" />
            <el-link type="primary" @click="showContent(3)">中石油克拉玛依石化有限责任公司 盲板、放空阀封堵管理办法</el-link>
          </div>
        </div>
      </el-card>
      <el-card style="margin-top: 5px;">
        <div class="title">
          <p>当前检查</p>
        </div>
        <ol v-loading="checkRecordLoading" class="check-record-list">
          <template v-for="item in checkRecordList">
            <el-tooltip :key="item.id" :disabled="item.checkStatus === 1" effect="dark" :content="getDaysLeft(item.nextRunTime)" placement="top" :open-delay="500">
              <el-badge :value="item.checkStatus === 0 ? '待检查' : ''" type="primary">
                <li
                  :style="{
                    color: item.checkStatus === 0 ? '#5eabf8' : '#000',
                    'border-bottom-color': item.checkStatus === 0 ? '#46a6ff' : '#000'
                  }"
                >
                  {{ item.type + ': ' + item.fullName + '\t' + item.className }}
                </li>
              </el-badge>
            </el-tooltip>
          </template>
        </ol>
      </el-card>
    </div>
    <div class="card-box-right">
      <el-card class="top-card">
        <div class="card-box-right-chart">
          <MbPie v-if="!deviceCountLoading" :data="pieSeriesData" :legend="pieLegend" />
          <OverviewBar v-if="!deviceCountLoading" :x-axis="barXAxis" :data="barSeriesData" />
        </div>
      </el-card>
      <el-card style="margin-top: 5px;">
        <CheckProgressBar v-if="!checkProgressLoading" :total-check="totalCheck" :data="checkProgressList" />
      </el-card>
    </div>

    <FileContent v-if="fileContentVisible" ref="FileContent" />
  </div>
</template>

<script>
import { getSumBills, getNewCheckRecords, getCheckProgress } from '@/api/home'

import FileContent from './components/FileContent'
import OverviewBar from './components/OverviewBar'
import MbPie from './components/MbPie'
import CheckProgressBar from './components/CheckProgressBar'

export default {
  name: 'Dashboard',

  components: {
    FileContent,
    OverviewBar,
    MbPie,
    CheckProgressBar
  },

  data() {
    return {
      fileContentVisible: false,
      deviceCountLoading: true,
      // 互窜点柱状图
      barRelation: {
        totalSludgeOil: {
          name: '地下污油',
          path: 'mutualChannelingPoints/undergroundSludgeOil'
        },
        totalHeatExchanger: {
          name: '换热器',
          path: 'mutualChannelingPoints/heatExchanger'
        },
        totalContainer: {
          name: '容器',
          path: 'mutualChannelingPoints/container'
        },
        totalKeyPoint: {
          name: '关键点',
          path: 'mutualChannelingPoints/keyPoint'
        },
        totalOtherPoint: {
          name: '其他',
          path: 'mutualChannelingPoints/otherPoint'
        }
      },
      barXAxis: [],
      barSeriesData: [],
      // 盲板饼图
      pieRelation: {
        totalShort: {
          name: '短期',
          path: 'mb/shortBill'
        },
        totalLong: {
          name: '长期',
          path: 'mb/longBill'
        }
      },
      pieSeriesData: [],
      pieLegend: [],
      // 检查列表
      checkRecordLoading: false,
      checkRecordList: [],
      // 检查进度图
      checkProgressList: [],
      totalCheck: 0,
      checkProgressLoading: true
    }
  },

  created() {
    this.getSumBills()
    this.getNewCheckRecords()
    this.getCheckProgress()
  },

  methods: {
    showContent(type) {
      this.fileContentVisible = true
      this.$nextTick(() => {
        this.$refs.FileContent.init(type)
      })
    },

    getSumBills() {
      this.deviceCountLoading = true
      getSumBills().then(res => {
        const sumBills = res.data
        // 互窜点
        for (const key in this.barRelation) {
          const xAxisName = this.barRelation[key].name
          const path = this.barRelation[key].path
          const total = sumBills[key]
          this.barXAxis.push(xAxisName)
          this.barSeriesData.push({ value: total, path })
        }
        // 盲板
        for (const key in this.pieRelation) {
          const name = this.pieRelation[key].name
          const path = this.pieRelation[key].path
          const total = sumBills[key]
          this.pieLegend.push({ name })
          this.pieSeriesData.push({ value: total, path, name })
        }
        this.deviceCountLoading = false
      }).catch(() => {
        this.deviceCountLoading = false
      })
    },

    getNewCheckRecords() {
      this.checkRecordLoading = true
      getNewCheckRecords().then(res => {
        this.checkRecordList = res.data.list
        this.checkRecordLoading = false
      }).catch(() => {
        this.checkRecordLoading = false
      })
    },

    getCheckProgress() {
      this.checkProgressLoading = true
      getCheckProgress().then(res => {
        const progressList = res.data.list
        progressList.sort((a, b) => a.progress - b.progress)
        this.checkProgressList = progressList.map(item => {
          return [item.progress, item.className]
        })
        this.totalCheck = res.data.totalCheck
        this.checkProgressLoading = false
      }).catch(() => {
        this.checkProgressLoading = false
      })
    },

    getDaysLeft(nextRunTime) {
      const now = Date.now()
      const endDate = new Date(nextRunTime).getTime()
      const daysTimeStamp = endDate - now
      if (daysTimeStamp < 0) return '已过期'
      const days = Math.floor(daysTimeStamp / (1000 * 60 * 60 * 24))
      if (days < 1) return '剩余时间：小于1天'
      return '剩余时间：' + days + '天'
    }
  }
}
</script>

<style lang="scss" scoped>
.BL-common-layout {
  padding: 5px;
  .card-box-left {
    display: flex;
    flex-direction: column;
    margin-right: 5px;
    // flex: 1;
    width: 40%;
    .title {
      height: 30px;
      line-height: 30px;
      padding-bottom: 10px;
      border-bottom: 1px solid #bbb;
    }
    .management-rules {
      height: calc(100% - 30px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .rule {
        padding: 10px 0;
      }
      .text-left {
        color: #999;
        font-size: 14px;
      }
    }
    .check-record-list {
      height: calc(100% - 30px);
      padding-top: 20px;
      padding-left: 30px;
      overflow-y: scroll;
      .el-badge {
        width: 85%;
      }
      li {
        font-size: 14px;
        margin-bottom: 15px;
        border-bottom: 1px solid #46a6ff;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .card-box-right {
    // flex: 1;
    width: 60%;
    display: flex;
    flex-direction: column;
    .card-box-right-chart {
      width: 100%;
      height: 100%;
      display: flex;
    }
  }
}
.top-card {
  height: 80%;
}
</style>
