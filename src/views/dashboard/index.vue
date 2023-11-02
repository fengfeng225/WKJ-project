<template>
  <div class="BL-common-layout">
    <div class="card-box first-card-box">
      <el-card>Charts</el-card>
    </div>
    <div class="card-box">
      <el-card>Check Plan</el-card>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.BL-common-layout {
  padding: 5px;
  .first-card-box {
    margin-right: 5px;
  }
  .card-box {
    flex: 1;
    .el-card {
      height: 100%;
    }
  }
}
</style>
