<template>
  <el-input ref="BLInputNumber" class="BL-input-number" :style="{width: width}" :value="observeData" v-bind="$attrs" @input="inputData" @blur="clearText" v-on="$listeners">

    <template #suffix>
      <span class="suffix-unit" @mousedown.prevent="clickUnit">
        <slot name="suffix" />
      </span>
      <el-button class="plus-btn" icon="el-icon-plus" @mousedown.native.prevent="add" />
      <el-button class="minus-btn" icon="el-icon-minus" @mousedown.native.prevent="minus" />
    </template>

    <template v-for="(value, name) in filterSlots" #[name]>
      <slot :name="name" />
    </template>

  </el-input>
</template>

<script>
import { deepClone } from '@/utils/util'

export default {
  name: 'BLInputNumber',

  model: {
    event: 'setValue'
  },

  props: {
    value: [Number, String],
    width: {
      default: '100%',
      type: String
    },
    step: {
      default: 1,
      type: Number
    },
    min: {
      default: 0,
      type: Number
    },
    max: {
      default: Infinity,
      type: Number
    }
  },

  data() {
    return {
      observeData: null,
      customData: null,
      inputText: null,
      addBtn: null,
      minusBtn: null
    }
  },

  computed: {
    filterSlots() {
      const slots = deepClone(this.$slots)
      if (slots.hasOwnProperty('suffix')) delete slots.suffix
      return slots
    }
  },

  watch: {
    value: function(val) {
      this.observeData = val

      this.judgeButtonAvailable(+val)
    }
  },

  mounted() {
    this.initData()
  },

  methods: {
    initData() {
      const BLInput = this.$refs.BLInputNumber.$el
      this.inputText = BLInput.querySelector('input')
      this.addBtn = BLInput.querySelector('.plus-btn')
      this.minusBtn = BLInput.querySelector('.minus-btn')

      this.observeData = this.value
      this.customData = this.value

      this.judgeButtonAvailable(+this.value)
    },

    judgeButtonAvailable(val) {
      this.addBtn.classList.remove('forbid')
      this.minusBtn.classList.remove('forbid')

      if (isNaN(val)) {
        this.minusBtn.classList.add('forbid')
        this.addBtn.classList.add('forbid')
      }

      if (val - this.step < this.min) {
        this.minusBtn.classList.add('forbid')

        if (val + this.step < this.min) {
          this.addBtn.classList.add('forbid')
        }
      }

      if (val + this.step > this.max) {
        this.addBtn.classList.add('forbid')

        if (val - this.step > this.max) {
          this.minusBtn.classList.add('forbid')
        }
      }
    },

    judgeTextDecoration(val) {
      if (isNaN(val) || val < this.min || val > this.max) {
        this.inputText.style.textDecoration = 'line-through'
        return true
      }

      this.inputText.style.textDecoration = 'none'
      return false
    },

    add(e) {
      this.focusHandler(e)
      if (this.addBtn.classList.contains('forbid')) return

      this.observeData = Number((+this.observeData + this.step).toFixed(2))
      this.customData = +this.observeData
      this.$emit('setValue', this.observeData)

      let repeatAdd
      const timer = setTimeout(() => {
        repeatAdd = setInterval(() => {
          if (this.addBtn.classList.contains('forbid')) {
            clearInterval(repeatAdd)
            return
          }

          this.observeData = Number((+this.observeData + this.step).toFixed(2))
          this.customData = +this.observeData
          this.$emit('setValue', this.observeData)
        }, 150)
      }, 1000)

      this.addBtn.addEventListener('mouseup', () => {
        clearTimeout(timer)
        clearInterval(repeatAdd)
      }, { once: true })
    },

    minus(e) {
      this.focusHandler(e)
      if (this.minusBtn.classList.contains('forbid')) return

      this.observeData = Number((+this.observeData - this.step).toFixed(2))
      this.customData = +this.observeData
      this.$emit('setValue', this.observeData)

      let repeatMinus
      const timer = setTimeout(() => {
        repeatMinus = setInterval(() => {
          if (this.minusBtn.classList.contains('forbid')) {
            clearInterval(repeatMinus)
            return
          }

          this.observeData = Number((+this.observeData - this.step).toFixed(2))
          this.customData = +this.observeData
          this.$emit('setValue', this.observeData)
        }, 150)
      }, 1000)

      this.minusBtn.addEventListener('mouseup', () => {
        clearTimeout(timer)
        clearInterval(repeatMinus)
      }, { once: true })
    },

    clickUnit() {
      this.inputText.focus()
    },

    inputData(val) {
      const legitimate = this.judgeTextDecoration(val)

      if (legitimate) {
        this.observeData = val
        return
      }

      const transVal = this.removeExtraZero(val)

      if (transVal === '') {
        this.customData = null
        this.$emit('setValue', null)
      } else {
        this.customData = +transVal
        this.observeData = transVal
        if (transVal.endsWith('.') || (transVal.includes('.') && transVal.endsWith('0'))) return
        else this.$emit('setValue', +transVal)
      }
    },

    clearText() {
      this.$emit('setValue', this.customData)
      this.observeData = this.customData
      this.inputText.style.textDecoration = 'none'
    },

    focusHandler(e) {
      let target = e.target
      if (target.nodeName === 'I') {
        target = e.target.parentNode
      }
      target.blur()
      this.inputText.focus()
    },

    removeExtraZero(val) {
      val = val.trim()

      let regexp = /^0+[1-9]/
      if (val.startsWith('-')) regexp = /^-0+[1-9]/

      while (regexp.test(val)) {
        val = val.replace('0', '')
      }

      return val
    }
  }
}
</script>

<style scoped lang="scss">
.BL-input-number {
  position: relative;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  &:hover,
  &:focus {
    border: 1px solid #409EFF;
  }

  ::v-deep input {
    border: none;
    &:hover,
    &:focus {
      border: none;
    }
  }
  ::v-deep .el-input__suffix-inner {
    margin-right: 25px;
  }
}

.el-button {
  position: absolute;
  padding: 0;
  margin: 0 !important;
  height: 16.5px;
  border-radius: 0;
  border-right: none;
  border-left: 1px solid #e4e4e4;
  &:hover,
  &:focus {
    background-color: #fff;
    border-color: #409EFF;
  }

  ::v-deep i {
    padding: 0 3px;
    width: 24px;
  }
}

.el-button.forbid :hover {
  cursor: not-allowed;
}

.suffix-unit {
  cursor: text;
}

.plus-btn {
  border-top: none;
  right: -5px;
  top: 0;
}
.minus-btn {
  border-bottom: none;
  border-top: 1px solid rgba(0, 0, 0, 0);
  right: -5px;
  bottom: 0;
}
</style>
