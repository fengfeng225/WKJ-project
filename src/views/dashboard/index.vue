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
            <el-link type="primary" @click="showContent(1)">炼油第三联合车间防互窜管理规定</el-link>
          </div>
          <div class="rule">
            <span class="text-left">公告</span>
            <el-divider direction="vertical" />
            <el-link type="primary" @click="showContent(2)">关于修订印发《中石油克拉玛依石化有限责任公司盲板、放空阀封堵管理办法》的通知</el-link>
          </div>
          <div class="rule">
            <span class="text-left">公告</span>
            <el-divider direction="vertical" />
            <el-link type="primary" @click="showContent(3)">中石油克拉玛依石化有限责任公司 盲板、放空阀封堵管理办法</el-link>
          </div>
        </div>
      </el-card>
      <el-card style="margin-top: 5px;">Check Plan</el-card>
    </div>
    <div class="card-box">
      <el-card>Charts</el-card>
    </div>

    <FileContent v-if="fileContentVisible" ref="FileContent" />
  </div>
</template>

<script>
import FileContent from './components/FileContent'

export default {
  name: 'Dashboard',

  components: {
    FileContent
  },

  data() {
    return {
      fileContentVisible: false
    }
  },

  methods: {
    showContent(type) {
      this.fileContentVisible = true
      this.$nextTick(() => {
        this.$refs.FileContent.init(type)
      })
    }
  }
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
