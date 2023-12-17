<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane v-if="shouldHide('second')" label="秒">
        <CrontabSecond ref="cronsecond" @update="updateContabValue" />
      </el-tab-pane>

      <el-tab-pane v-if="shouldHide('min')" label="分钟">
        <CrontabMin
          ref="cronmin"
          :cron="contabValueObj"
          @update="updateContabValue"
        />
      </el-tab-pane>

      <el-tab-pane v-if="shouldHide('hour')" label="小时">
        <CrontabHour
          ref="cronhour"
          :cron="contabValueObj"
          @update="updateContabValue"
        />
      </el-tab-pane>

      <el-tab-pane v-if="shouldHide('day')" label="日">
        <CrontabDay
          ref="cronday"
          :cron="contabValueObj"
          @update="updateContabValue"
          @dayChange="dayChange"
        />
      </el-tab-pane>

      <el-tab-pane v-if="shouldHide('month')" label="月">
        <CrontabMonth
          ref="cronmonth"
          :cron="contabValueObj"
          @update="updateContabValue"
        />
      </el-tab-pane>

      <el-tab-pane v-if="shouldHide('week')" label="周">
        <CrontabWeek
          ref="cronweek"
          :cron="contabValueObj"
          @update="updateContabValue"
          @weekChange="weekChange"
        />
      </el-tab-pane>

      <el-tab-pane v-if="shouldHide('year')" label="年">
        <CrontabYear
          ref="cronyear"
          :cron="contabValueObj"
          @update="updateContabValue"
        />
      </el-tab-pane>
    </el-tabs>

    <div class="popup-main">
      <div class="popup-result">
        <p class="title">时间表达式</p>
        <table>
          <thead>
            <th v-for="item of tabTitles" :key="item" width="40">{{ item }}</th>
            <th>crontab完整表达式</th>
          </thead>
          <tbody>
            <td>
              <span>{{ contabValueObj.second }}</span>
            </td>
            <td>
              <span>{{ contabValueObj.min }}</span>
            </td>
            <td>
              <span>{{ contabValueObj.hour }}</span>
            </td>
            <td>
              <span>{{ contabValueObj.day }}</span>
            </td>
            <td>
              <span>{{ contabValueObj.month }}</span>
            </td>
            <td>
              <span>{{ contabValueObj.week }}</span>
            </td>
            <td>
              <span>{{ contabValueObj.year }}</span>
            </td>
            <td>
              <span>{{ contabValueString }}</span>
            </td>
          </tbody>
        </table>
      </div>
      <CrontabResult :ex="contabValueString" />

      <div class="pop_btn">
        <el-button size="small" type="primary" @click="submitFill">确定</el-button>
        <el-button size="small" type="warning" @click="clearCron">重置</el-button>
        <el-button size="small" @click="hidePopup">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import CrontabSecond from './Crontab-Second'
import CrontabMin from './Crontab-Min'
import CrontabHour from './Crontab-Hour'
import CrontabDay from './Crontab-Day'
import CrontabMonth from './Crontab-Month'
import CrontabWeek from './Crontab-Week'
import CrontabYear from './Crontab-Year'
import CrontabResult from './Crontab-Result'

export default {
  name: 'Vcrontab',
  components: {
    CrontabSecond,
    CrontabMin,
    CrontabHour,
    CrontabDay,
    CrontabMonth,
    CrontabWeek,
    CrontabYear,
    CrontabResult
  },
  props: {
    expression: {
      type: String,
      default: '* * * * * *' // 兼容 ? 改 *
    },
    hideComponent: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tabTitles: ['秒', '分钟', '小时', '日', '月', '周', '年'],
      tabActive: 0,
      contabValueObj: {
        second: '*',
        min: '*',
        hour: '*',
        day: '*',
        month: '*',
        week: '*', // 兼容 ? 改 *
        year: ''
      }
    }
  },
  computed: {
    contabValueString() {
      const obj = this.contabValueObj
      const str =
        obj.second +
        ' ' +
        obj.min +
        ' ' +
        obj.hour +
        ' ' +
        obj.day +
        ' ' +
        obj.month +
        ' ' +
        obj.week +
        (obj.year === '' ? '' : ' ' + obj.year)
      return str
    }
  },
  watch: {
    expression: 'resolveExp',
    hideComponent(value) {
      // 隐藏部分组件
    }
  },
  mounted() {
    this.resolveExp()
  },
  methods: {
    shouldHide(key) {
      if (this.hideComponent && this.hideComponent.includes(key)) return false
      return true
    },
    resolveExp() {
      // 反解析 表达式
      if (this.expression) {
        const arr = this.expression.split(' ')
        if (arr.length >= 6) {
          // 6 位以上是合法表达式
          const obj = {
            second: arr[0],
            min: arr[1],
            hour: arr[2],
            day: arr[3],
            month: arr[4],
            week: arr[5],
            year: arr[6] ? arr[6] : ''
          }
          this.contabValueObj = {
            ...obj
          }
          for (const key in obj) {
            if (obj[key]) this.changeRadio(key, obj[key])
          }
        }
      } else {
        // 没有传入的表达式 则还原
        this.clearCron()
      }
    },
    // tab切换值
    tabCheck(index) {
      this.tabActive = index
    },
    // 由子组件触发，更改表达式组成的字段值
    updateContabValue(name, value, from) {
      this.contabValueObj[name] = value
    },
    // 赋值到组件
    changeRadio(name, value) {
      const arr = ['second', 'min', 'hour', 'month']
      const refName = 'cron' + name
      let insValue

      if (!this.$refs[refName]) return

      if (arr.includes(name)) {
        if (value === '*') {
          insValue = 1
        } else if (value.indexOf('-') > -1) {
          const indexArr = value.split('-')
          isNaN(indexArr[0])
            ? (this.$refs[refName].cycle01 = 0)
            : (this.$refs[refName].cycle01 = indexArr[0])
          this.$refs[refName].cycle02 = indexArr[1]
          insValue = 2
        } else if (value.indexOf('/') > -1) {
          const indexArr = value.split('/')
          isNaN(indexArr[0])
            ? (this.$refs[refName].average01 = 0)
            : (this.$refs[refName].average01 = indexArr[0])
          this.$refs[refName].average02 = indexArr[1]
          insValue = 3
        } else {
          insValue = 4
          this.$refs[refName].checkboxList = value.split(',')
        }
      } else if (name === 'day') {
        if (value === '*') {
          insValue = 1
        } else if (value === '?') {
          insValue = 2
        } else if (value.indexOf('-') > -1) {
          const indexArr = value.split('-')
          isNaN(indexArr[0])
            ? (this.$refs[refName].cycle01 = 0)
            : (this.$refs[refName].cycle01 = indexArr[0])
          this.$refs[refName].cycle02 = indexArr[1]
          insValue = 3
        } else if (value.indexOf('/') > -1) {
          const indexArr = value.split('/')
          isNaN(indexArr[0])
            ? (this.$refs[refName].average01 = 0)
            : (this.$refs[refName].average01 = indexArr[0])
          this.$refs[refName].average02 = indexArr[1]
          insValue = 4
        } else if (value.indexOf('W') > -1) {
          const indexArr = value.split('W')
          isNaN(indexArr[0])
            ? (this.$refs[refName].workday = 0)
            : (this.$refs[refName].workday = indexArr[0])
          insValue = 5
        } else if (value === 'L') {
          insValue = 6
        } else {
          this.$refs[refName].checkboxList = value.split(',')
          insValue = 7
        }
      } else if (name === 'week') {
        if (value === '*') {
          insValue = 1
        } else if (value === '?') {
          insValue = 2
        } else if (value.indexOf('-') > -1) {
          const indexArr = value.split('-')
          isNaN(indexArr[0])
            ? (this.$refs[refName].cycle01 = 0)
            : (this.$refs[refName].cycle01 = indexArr[0])
          this.$refs[refName].cycle02 = indexArr[1]
          insValue = 3
        } else if (value.indexOf('#') > -1) {
          const indexArr = value.split('#')
          isNaN(indexArr[0])
            ? (this.$refs[refName].average01 = 1)
            : (this.$refs[refName].average01 = indexArr[0])
          this.$refs[refName].average02 = indexArr[1]
          insValue = 4
        } else if (value.indexOf('L') > -1) {
          const indexArr = value.split('L')
          isNaN(indexArr[0])
            ? (this.$refs[refName].weekday = 1)
            : (this.$refs[refName].weekday = indexArr[0])
          insValue = 5
        } else {
          this.$refs[refName].checkboxList = value.split(',')
          insValue = 6
        }
      } else if (name === 'year') {
        if (value === '') {
          insValue = 1
        } else if (value === '*') {
          insValue = 2
        } else if (value.indexOf('-') > -1) {
          insValue = 3
        } else if (value.indexOf('/') > -1) {
          insValue = 4
        } else {
          this.$refs[refName].checkboxList = value.split(',')
          insValue = 5
        }
      }
      this.$nextTick(() => {
        this.$refs[refName].radioValue = insValue
      })
    },
    // 隐藏弹窗
    hidePopup() {
      this.$emit('hide')
    },
    // 填充表达式
    submitFill() {
      this.$emit('fill', this.contabValueString)
      this.hidePopup()
    },
    clearCron() {
      // 还原选择项
      this.contabValueObj = {
        second: '*',
        min: '*',
        hour: '*',
        day: '*',
        month: '*',
        week: '*', // 兼容 ? 改 *
        year: ''
      }
      for (const j in this.contabValueObj) {
        this.changeRadio(j, this.contabValueObj[j])
      }
    },

    // weekChange() {
    //   this.$refs.cronday.weekChange()
    // },

    // dayChange() {
    //   this.$refs.cronweek.dayChange()
    // }

    weekChange(radioValue) {
      this.$refs.cronday.weekChange(radioValue)
    },

    dayChange(radioValue) {
      this.$refs.cronweek.dayChange(radioValue)
    }
  }
}
</script>
<style scoped>
.pop_btn {
  text-align: center;
  margin-top: 20px;
}
.popup-main {
  position: relative;
  margin: 10px auto;
  background: #fff;
  border-radius: 5px;
  font-size: 12px;
  overflow: hidden;
}
.popup-title {
  overflow: hidden;
  line-height: 34px;
  padding-top: 6px;
  background: #f2f2f2;
}
.popup-result {
  box-sizing: border-box;
  line-height: 24px;
  margin: 25px auto;
  padding: 15px 10px 10px;
  border: 1px solid #ccc;
  position: relative;
}
.popup-result .title {
  position: absolute;
  top: -28px;
  left: 50%;
  width: 140px;
  font-size: 14px;
  margin-left: -70px;
  text-align: center;
  line-height: 30px;
  background: #fff;
}
.popup-result table {
  text-align: center;
  width: 100%;
  margin: 0 auto;
}
.popup-result table span {
  display: block;
  width: 100%;
  font-family: arial;
  line-height: 30px;
  height: 30px;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}
.popup-result-scroll {
  font-size: 12px;
  line-height: 24px;
  height: 10em;
  overflow-y: auto;
}
</style>
