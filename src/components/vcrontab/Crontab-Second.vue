<template>
  <el-form size="small">
    <el-form-item>
      <el-radio v-model="radioValue" :label="1">
        秒，允许的通配符[, - * /]
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="2">
        周期从
        <el-input-number v-model="cycle01" :min="0" :max="60" :step="1" step-strictly /> -
        <el-input-number v-model="cycle02" :min="0" :max="60" :step="1" step-strictly /> 秒
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="3">
        从
        <el-input-number v-model="average01" :min="0" :max="60" :step="1" step-strictly /> 秒开始，每
        <el-input-number v-model="average02" :min="0" :max="60" :step="1" step-strictly /> 秒执行一次
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="4">
        指定
        <el-select v-model="checkboxList" clearable placeholder="可多选" multiple style="width:100%">
          <el-option v-for="item in 60" :key="item" :value="item-1">{{ item-1 }}</el-option>
        </el-select>
      </el-radio>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CrontabSecond',
  props: {
    radioParent: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      radioValue: 1,
      cycle01: 1,
      cycle02: 2,
      average01: 0,
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
    'checkboxString': 'checkboxChange',
    radioParent() {
      this.radioValue = this.radioParent
    }
  },
  methods: {
    // 单选按钮值变化时
    radioChange() {
      switch (this.radioValue) {
        case 1:
          this.$emit('update', 'second', '*', 'second')
          // this.$emit('update', 'min', '*', 'second')
          break
        case 2:
          this.$emit('update', 'second', this.cycle01 + '-' + this.cycle02)
          break
        case 3:
          this.$emit('update', 'second', this.average01 + '/' + this.average02)
          break
        case 4:
          this.$emit('update', 'second', this.checkboxString)
          break
      }
    },
    // 周期两个值变化时
    cycleChange() {
      if (this.radioValue === 2) {
        this.$emit('update', 'second', this.cycleTotal)
      }
    },
    // 平均两个值变化时
    averageChange() {
      if (this.radioValue === 3) {
        this.$emit('update', 'second', this.averageTotal)
      }
    },
    // checkbox值变化时
    checkboxChange() {
      if (this.radioValue === 4) {
        this.$emit('update', 'second', this.checkboxString)
      }
    },
    othChange() {
      // 反解析
      const ins = this.cron.second('反解析 second', ins)
      if (ins === '*') {
        this.radioValue = 1
      } else if (ins.indexOf('-') > -1) {
        this.radioValue = 2
      } else if (ins.indexOf('/') > -1) {
        this.radioValue = 3
      } else {
        this.radioValue = 4
        this.checkboxList = ins.split(',')
      }
    }
  }
}
</script>
