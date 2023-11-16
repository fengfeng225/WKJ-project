<template>
  <div class="app-container Profile-container">
    <el-tabs v-model="activeTab" tab-position="left" style="height:100%" class="profile-tabs">
      <el-tab-pane label="个人资料" name="user">
        <UserInfo v-if="activeTab === 'user'" ref="user" />
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="password">
        <Password v-if="activeTab === 'password'" ref="password" />
      </el-tab-pane>
      <el-tab-pane disabled name="line" />
    </el-tabs>
    <div class="head">
      <el-avatar :size="50" icon="el-icon-user-solid" class="user-avatar" />
      <span class="username">{{ userInfo.userName }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserInfo from './components/UserInfo'
import Password from './components/Password'

export default {
  name: 'Profile',
  components: { UserInfo, Password },
  data() {
    return {
      activeTab: 'user'
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.Profile-container {
  position: relative;
  padding-top: 10px;

  .profile-tabs {
    ::v-deep .el-tabs__nav-scroll {
      padding-top: 70px;
    }

    ::v-deep .el-tabs__item {
      text-align: left !important;
    }

    ::v-deep .el-tabs__content {
      height: 100%;

      .el-tab-pane {
        height: 100%;
        overflow: auto;
        overflow-x: hidden;

        &.el-tab-pane-authorize {
          overflow: hidden;
        }
      }
    }

    ::v-deep #tab-line {
      height: 20px;
      width: 160px;

      &::after {
        position: absolute;
        width: 100%;
        height: 1px;
        background: #ddd;
        content: '';
        display: block;
        overflow: hidden;
        top: 10px;
        left: 0;
      }
    }
  }

  .head {
    display: flex;
    align-items: center;
    position: absolute;
    left: 10px;
    top: 10px;
    width: 160px;
    padding-top: 10px;
    .user-avatar {
      margin-right: 10px;
    }
    .username {
      line-height: 50px;
      font-size: 14px;
    }
  }
}
</style>
