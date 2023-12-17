<template>
  <el-form size="small">
    <el-form-item>
      <el-radio v-model="radioValue" :label="1">
        月，允许的通配符[, - * /]
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="2">
        周期从
        <el-input-number v-model="cycle01" :min="1" :max="12" :step="1" step-strictly /> -
        <el-input-number v-model="cycle02" :min="1" :max="12" :step="1" step-strictly /> 月
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="3">
        从
        <el-input-number v-model="average01" :min="1" :max="12" :step="1" step-strictly /> 月开始，每
        <el-input-number v-model="average02" :min="1" :max="12" :step="1" step-strictly /> 月月执行一次
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="4">
        指定
        <el-select v-model="checkboxList" clearable placeholder="可多选" multiple style="width:100%">
          <el-option v-for="item in 12" :key="item" :value="item">{{ item }}</el-option>
        </el-select>
      </el-radio>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CrontabMonth',
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
    'checkboxString': 'checkboxChange'
  },
  methods: {
    // 单选按钮值变化时
    radioChange() {
      // if (this.radioValue === 1) {
      //   this.$emit('update', 'month', '*')
      //   this.$emit('update', 'year', '*')
      // } else {
      //   if (this.cron.day === '*') {
      //     this.$emit('update', 'day', '0', 'month')
      //   }
      //   if (this.cron.hour === '*') {
      //     this.$emit('update', 'hour', '0', 'month')
      //   }
      //   if (this.cron.min === '*') {
      //     this.$emit('update', 'min', '0', 'month')
      //   }
      //   if (this.cron.second === '*') {
      //     this.$emit('update', 'second', '0', 'month')
      //   }
      // }
      switch (this.radioValue) {
        case 1:
          this.$emit('update', 'month', '*')
          break
        case 2:
          this.$emit('update', 'month', this.cycle01 + '-' + this.cycle02)
          break
        case 3:
          this.$emit('update', 'month', this.average01 + '/' + this.average02)
          break
        case 4:
          this.$emit('update', 'month', this.checkboxString)
          break
      }
    },
    // 周期两个值变化时
    cycleChange() {
      if (this.radioValue === 2) {
        this.$emit('update', 'month', this.cycleTotal)
      }
    },
    // 平均两个值变化时
    averageChange() {
      if (this.radioValue === 3) {
        this.$emit('update', 'month', this.averageTotal)
      }
    },
    // checkbox值变化时
    checkboxChange() {
      if (this.radioValue === 4) {
        this.$emit('update', 'month', this.checkboxString)
      }
    }
  }
}
</script>
