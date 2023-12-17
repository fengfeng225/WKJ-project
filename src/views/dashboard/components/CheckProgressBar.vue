<template>
  <div ref="echarts" :style="{width: '100%', height: height}" />
</template>

<script>
import * as echarts from 'echarts'
import resize from '@/mixins/resize'

export default {
  name: 'CheckProgressBar',
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
    totalCheck: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null,
      options: {
        title: {
          text: '检查进度'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          min: 0,
          max: this.totalCheck,
          interval: 1,
          splitLine: {
            show: false
          },
          axisLine: {
            show: true
          }
        },
        yAxis: {
          type: 'category',
          axisTick: {
            show: false
          }
        },
        visualMap: {
          orient: 'horizontal',
          left: 'center',
          top: '10px',
          min: 1,
          max: this.totalCheck,
          text: ['fast', 'slow'],
          dimension: 0,
          inRange: {
            color: ['#fac958', '#91cc76']
          }
        },
        series: {
          name: '检查进度',
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            borderRadius: 20
          },
          data: this.data,
          itemStyle: {
            borderRadius: 20
          }
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
    }
  }
}
</script>

<style>

</style>

