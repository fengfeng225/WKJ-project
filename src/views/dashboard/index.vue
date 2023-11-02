<template>
  <div class="BL-common-layout">
    <div class="card-box first-card-box">
      <el-card>
        <div class="title">
          <p>管理规定</p>
        </div>
        <div class="management-rules">
          <div class="rule">
            <span class="text-left">公告</span>
            <el-divider direction="vertical" />
            <el-link type="primary">炼油第三联合车间防互窜管理规定</el-link>
          </div>
          <div>
            <span class="text-left">公告</span>
            <el-divider direction="vertical" />
            <el-link type="primary">关于修订印发《中石油克拉玛依石化有限责任公司盲板、放空阀封堵管理办法》的通知</el-link>
          </div>
        </div>
      </el-card>
      <el-card>Check Plan</el-card>
    </div>
    <div class="card-box">
      <el-card>Charts</el-card>
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
    display: flex;
    flex-direction: column;
    margin-right: 5px;
  }
  .card-box {
    flex: 1;
    width: 0;
    .title {
      height: 30px;
      line-height: 30px;
      padding-bottom: 10px;
      border-bottom: 1px solid #bbb;
    }
    .management-rules {
      height: calc(100% - 30px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .rule {
        padding: 10px 0;
      }
      .text-left {
        color: #999;
        font-size: 14px;
      }
    }
  }
}
</style>
