<template>
  <div ref="echarts" :style="{width: '40%', height: height}" />
</template>

<script>
import * as echarts from 'echarts'
import resize from '@/mixins/resize'

export default {
  name: 'MbPie',
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
    legend: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null,
      options: {
        title: {
          text: '盲板',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {d}%'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.legend,
          formatter: (params) => {
            const value = this.data.find(item => params === item.name).value
            return value ? params + '\t' + value : params + '\t' + 0
          }
        },
        series: {
          type: 'pie',
          avoidLabelOverlap: true,
          // center: ['40%', '50%'],
          radius: ['35%', '60%'],
          minAngle: 5,
          itemStyle: {
            // borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'center',
            formatter: () => {
              const count = this.data.reduce((count, item) => count + item.value, 0)
              return '总数: ' + count
            }
          },
          data: this.data
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
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
