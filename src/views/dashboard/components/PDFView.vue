<template>
  <transition name="el-zoom-in-center">
    <div class="BL-preview-main">
      <div class="BL-common-page-header">
        <el-page-header @back="goBack" />
        <div class="options">
          <el-button @click="goBack">关闭</el-button>
        </div>
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
.BL-common-page-header {
  padding: 5px 10px;
}
</style>
