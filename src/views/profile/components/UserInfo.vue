<template>
  <div class="userInfo">
    <el-tabs class="HG-el_tabs">
      <el-tab-pane label="基本信息">
        <el-col :span="12">
          <el-form :model="userInfo" label-width="100px">
            <el-form-item label="账户">
              <el-input v-model="userInfo.account" readonly />
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="userInfo.userName" readonly />
            </el-form-item>
            <el-form-item label="注册时间">
              <el-input v-model="creatorTime" readonly />
            </el-form-item>
          </el-form>
        </el-col>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { dateFormat } from '@/utils'

export default {
  props: {
    userInfo: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    creatorTime() {
      return dateFormat(this.userInfo.creatorTime)
    }
  }
}
</script>
<style lang="scss" scoped>
  .userInfo {
    height: 100%;
    overflow: hidden;

    ::v-deep .el-tabs__nav-scroll {
      padding-top: 0 !important;
    }
  }
</style>
