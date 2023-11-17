<template>
  <div class="popup-result">
    <p class="title">最近5次运行时间</p>
    <ul class="popup-result-scroll">
      <template v-if="isShow">
        <li v-for="item in resultList" :key="item">{{ item }}</li>
      </template>
      <li v-else>计算结果中...</li>
    </ul>
  </div>
</template>

<script>
import cronParser from 'cron-parser'
import { dateFormat } from '@/utils'

export default {
  name: 'CrontabResult',
  props: {
    ex: {
      type: String,
      default: '* * * * * ?'
    }
  },
  data() {
    return {
      dayRule: '',
      dayRuleSup: '',
      dateArr: [],
      resultList: [],
      isShow: false
    }
  },
  watch: {
    'ex': 'getRunTime'
  },
  mounted() {
    // 初始化 获取一次结果
    this.$nextTick(() => {
      this.getRunTime()
    })
  },
  methods: {
    getRunTime() {
      try {
        this.isShow = false
        const nextFiveRunTimes = this.getNextFiveRunTimes(this.ex)
        this.resultList = nextFiveRunTimes
        this.isShow = true
      } catch (error) {
        this.resultList = ['表达式有误，请更改！']
        this.isShow = true
        console.log(error)
      }
    },

    getNextFiveRunTimes(cronExpression) {
      const options = {
        currentDate: new Date(),
        iterator: true
      }

      const interval = cronParser.parseExpression(cronExpression, options)
      const nextFiveRunTimes = []

      for (let i = 0; i < 5; i++) {
        const { value } = interval.next()
        nextFiveRunTimes.push(dateFormat(value.toDate(), 'YYYY-MM-DD HH:mm:ss'))
      }

      return nextFiveRunTimes
    }
  }
}

</script>

<style lang="scss" scoped>
li {
  list-style: none;
}
</style>
