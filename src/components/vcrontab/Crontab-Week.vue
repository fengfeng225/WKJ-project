<template>
  <el-form size="small">
    <el-form-item>
      <el-radio v-model="radioValue" :label="1">
        周，允许的通配符[, - * / L #]
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="2">
        不指定
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="3">
        周期从星期
        <el-input-number v-model="cycle01" :min="1" :max="7" :step="1" step-strictly /> -
        <el-input-number v-model="cycle02" :min="1" :max="7" :step="1" step-strictly />
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="4">
        第
        <el-input-number v-model="average01" :min="1" :max="4" :step="1" step-strictly /> 周的星期
        <el-input-number v-model="average02" :min="1" :max="7" :step="1" step-strictly />
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="5">
        本月最后一个星期
        <el-input-number v-model="weekday" :min="1" :max="7" :step="1" step-strictly />
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="6">
        指定
        <el-select v-model="checkboxList" clearable placeholder="可多选" multiple style="width:100%">
          <el-option v-for="(item,index) of weekList" :key="index" :value="index+1">{{ item }}</el-option>
        </el-select>
      </el-radio>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: 'CrontabWeek',
  props: {
    cron: {
      type: Object,
      default: () => {
        return {
          second: '*',
          min: '*',
          hour: '*',
          day: '*',
          month: '*',
          week: '*', // 兼容 ? 改 *
          year: ''
        }
      }
    }
  },
  data() {
    return {
      radioValue: 2,
      weekday: 1,
      cycle01: 1,
      cycle02: 2,
      average01: 1,
      average02: 1,
      checkboxList: [],
      weekList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    }
  },
  computed: {
    // 计算两个周期值
    cycleTotal: function() {
      return this.cycle01 + '-' + this.cycle02
    },
    // 计算平均用到的值
    averageTotal: function() {
      return this.average01 + '#' + this.average02
    },
    // 最近的工作日（格式）
    weekdayCheck: function() {
      return this.weekday
    },
    // 计算勾选的checkbox值合集
    checkboxString: function() {
      const str = this.checkboxList.join()
      return str === '' ? '*' : str
    }
  },
  watch: {
    'radioValue': 'radioChange',
    'cycleTotal': 'cycleChange',
    'averageTotal': 'averageChange',
    'weekdayCheck': 'weekdayChange',
    'checkboxString': 'checkboxChange'
  },
  methods: {
    // 单选按钮值变化时
    radioChange() {
      switch (this.radioValue) {
        case 1:
          this.$emit('update', 'week', '*')
          break
        case 2:
          this.$emit('update', 'week', '*') // 兼容 ? 改 *
          break
        case 3:
          this.$emit('update', 'week', this.cycle01 + '-' + this.cycle02)
          break
        case 4:
          this.$emit('update', 'week', this.average01 + '#' + this.average02)
          break
        case 5:
          this.$emit('update', 'week', this.weekday + 'L')
          break
        case 6:
          this.$emit('update', 'week', this.checkboxString)
          break
      }
      // this.$emit('weekChange')
      this.$emit('weekChange', this.radioValue)
    },
    // 根据互斥事件，更改radio的值

    // 周期两个值变化时
    cycleChange() {
      if (this.radioValue === 3) {
        this.$emit('update', 'week', this.cycleTotal)
      }
    },
    // 平均两个值变化时
    averageChange() {
      if (this.radioValue === 4) {
        this.$emit('update', 'week', this.averageTotal)
      }
    },
    // 最近工作日值变化时
    weekdayChange() {
      if (this.radioValue === 5) {
        this.$emit('update', 'week', this.weekday + 'L')
      }
    },
    // checkbox值变化时
    checkboxChange() {
      if (this.radioValue === 6) {
        this.$emit('update', 'week', this.checkboxString)
      }
    },

    // dayChange() {
    //   // 判断week值与day不能同时为“?”
    //   if (this.cron.day === '?' && this.radioValue === 2) {
    //     this.radioValue = 1
    //   } else if (this.cron.day !== '?' && this.radioValue !== 2) {
    //     this.radioValue = 2
    //   }
    // }
    dayChange(radioValue) {
      // 判断week值与day至少有一个为“*” 兼容
      if (this.cron.week !== '*' && radioValue !== 1 && radioValue !== 2) {
        this.radioValue = 2
      }
    }
  }
}
</script>
