<template>
  <el-form size="small">
    <el-form-item>
      <el-radio v-model="radioValue" :label="1">
        日，允许的通配符[, - * / L M]
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="2">
        不指定
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="3">
        周期从
        <el-input-number v-model="cycle01" :min="0" :max="31" :step="1" step-strictly /> -
        <el-input-number v-model="cycle02" :min="0" :max="31" :step="1" step-strictly /> 日
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="4">
        从
        <el-input-number v-model="average01" :min="0" :max="31" :step="1" step-strictly /> 号开始，每
        <el-input-number v-model="average02" :min="0" :max="31" :step="1" step-strictly /> 日执行一次
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="5">
        每月
        <el-input-number v-model="workday" :min="0" :max="31" :step="1" step-strictly /> 号最近的那个工作日
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="6">
        本月最后一天
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="7">
        指定
        <el-select v-model="checkboxList" clearable placeholder="可多选" multiple style="width:100%">
          <el-option v-for="item in 31" :key="item" :value="item">{{ item }}</el-option>
        </el-select>
      </el-radio>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CrontabDay',
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
      radioValue: 1,
      workday: 1,
      cycle01: 1,
      cycle02: 2,
      average01: 1,
      average02: 1,
      checkboxList: []
    }
  },
  computed: {
    // 计算两个周期值
    cycleTotal: function() {
      return this.cycle01 + '-' + this.cycle02
    },
    // 计算平均用到的值
    averageTotal: function() {
      return this.average01 + '/' + this.average02
    },
    // 计算工作日格式
    workdayCheck: function() {
      return this.workday
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
    'workdayCheck': 'workdayChange',
    'checkboxString': 'checkboxChange'
  },
  methods: {
    // 单选按钮值变化时
    radioChange() {
      switch (this.radioValue) {
        case 1:
          this.$emit('update', 'day', '*')
          break
        case 2:
          this.$emit('update', 'day', '*') // 兼容 ? 改 *
          break
        case 3:
          this.$emit('update', 'day', this.cycle01 + '-' + this.cycle02)
          break
        case 4:
          this.$emit('update', 'day', this.average01 + '/' + this.average02)
          break
        case 5:
          this.$emit('update', 'day', this.workday + 'W')
          break
        case 6:
          this.$emit('update', 'day', 'L')
          break
        case 7:
          this.$emit('update', 'day', this.checkboxString)
          break
      }
      // this.$emit('dayChange')
      this.$emit('dayChange', this.radioValue)
    },
    // 周期两个值变化时
    cycleChange() {
      if (this.radioValue === 3) {
        this.$emit('update', 'day', this.cycleTotal)
      }
    },
    // 平均两个值变化时
    averageChange() {
      if (this.radioValue === 4) {
        this.$emit('update', 'day', this.averageTotal)
      }
    },
    // 最近工作日值变化时
    workdayChange() {
      if (this.radioValue === 5) {
        this.$emit('update', 'day', this.workday + 'W')
      }
    },
    // checkbox值变化时
    checkboxChange() {
      if (this.radioValue === 7) {
        this.$emit('update', 'day', this.checkboxString)
      }
    },
    // 父组件传递的week发生变化触发
    // weekChange() {
    //   // 判断week值与day不能同时为“?”
    //   if (this.cron.week === '?' && this.radioValue === 2) {
    //     this.radioValue = 1
    //   } else if (this.cron.week !== '?' && this.radioValue !== 2) {
    //     this.radioValue = 2
    //   }
    // }
    weekChange(radioValue) {
      // 判断week值与day至少有一个为“*” 兼容
      if (this.cron.day !== '*' && radioValue !== 1 && radioValue !== 2) {
        this.radioValue = 2
      }
    }
  }
}
</script>
