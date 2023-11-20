<template>
  <transition name="el-zoom-in-center">
    <div class="BL-preview-main user-form">
      <div class="BL-common-page-header">
        <el-page-header content="台账" @back="goBack" />
        <div class="options">
          <el-button @click="goBack">返回</el-button>
        </div>
      </div>
      <div class="main">
        <img class="bill" src="" alt="">
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.bill {
  width: 100%;
  height: 100%;
}
</style>
