<template>
  <div class="BL-common-layout">
    <div class="card-box-left">
      <el-card>
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
      <el-card style="margin-top: 5px;">Check Plan</el-card>
    </div>
    <div class="card-box-right">
      <el-card>
        <OverviewBar v-if="loaded" :x-axis="xAxis" :data="seriesData" />
      </el-card>
      <el-card style="margin-top: 5px;">Check Plan Charts</el-card>
    </div>

    <FileContent v-if="fileContentVisible" ref="FileContent" />
  </div>
</template>

<script>
import { getSumBills } from '@/api/home'

import FileContent from './components/FileContent'
import OverviewBar from './components/OverviewBar'

export default {
  name: 'Dashboard',

  components: {
    FileContent,
    OverviewBar
  },

  data() {
    return {
      fileContentVisible: false,
      loaded: false,
      billRelation: {
        totalShort: {
          name: '短期台账',
          path: 'mb/shortBill'
        },
        totalLong: {
          name: '长期台账',
          path: 'mb/longBill'
        }
      },
      xAxis: [],
      seriesData: []
    }
  },

  created() {
    this.getSumBills()
  },

  methods: {
    showContent(type) {
      this.fileContentVisible = true
      this.$nextTick(() => {
        this.$refs.FileContent.init(type)
      })
    },

    getSumBills() {
      getSumBills().then(res => {
        const sumBills = res.data
        for (const key in sumBills) {
          const xAxisName = this.billRelation[key].name
          const path = this.billRelation[key].path
          const total = sumBills[key]
          this.xAxis.push(xAxisName)
          this.seriesData.push({ value: total, path })
        }
        this.loaded = true
      }).catch(() => {})
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
    flex: 1;
    width: 0;
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
  }
  .card-box-right {
    flex: 1;
    width: 0;
    display: flex;
    flex-direction: column;
  }
}
</style>
