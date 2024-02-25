<template>
  <transition name="el-zoom-in-center">
    <div class="BL-preview-main">
      <div class="goback">
        <i class="el-icon-circle-close" @click="goBack" />
      </div>
      <iframe
        :src="'./pdf/' + pdfName + '.pdf#navpanes=0'"
        width="100%"
        height="100%"
      />
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    pdfName: {
      type: String,
      default: ''
    }
  },

  methods: {
    goBack() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.goback {
  position: absolute;
  top: 20px;
  right: 130px;
  color: #fff;
  font-size: 18px;
  &:hover {
    cursor: pointer;
  }
}
</style>
