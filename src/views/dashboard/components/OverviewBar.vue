<template>
  <div ref="echarts" :style="{width: '60%', height: height}" />
</template>

<script>
import * as echarts from 'echarts'
import resize from '@/mixins/resize'

export default {
  name: 'OverviewBar',
  mixins: [resize],
  props: {
    height: {
      type: String,
      default: '100%'
    },
    data: {
      type: Array,
      default: () => []
    },
    xAxis: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null,
      options: {
        title: {
          text: '互窜点',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '60px',
          bottom: '20px',
          left: '45px',
          right: '65px'
        },
        xAxis: {
          type: 'category',
          name: '台账类别',
          data: this.xAxis,
          axisTick: {
            alignWithLabel: true,
            interval: 0
          },
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '总数',
          axisLine: {
            show: true
          }
        },
        series: {
          name: '总数',
          type: 'bar',
          barWidth: '30%',
          label: {
            show: true,
            position: 'top'
          },
          data: this.data,
          color: '#73c0de'
        }
      }
    }
  },
  mounted() {
    this.$nextTick(this.initChart)
  },
  beforedestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.echarts)
      this.chart.setOption(this.options, true)
      this.chart.on('click', params => {
        if (params.data.path) {
          const path = '/bill/' + params.data.path
          this.$router.push(path)
        }
      })
    }
  }
}
</script>

<style>

</style>

