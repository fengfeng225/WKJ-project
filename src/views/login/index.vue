<template>
  <div class="login-container">
    <div class="login-version">
      <p class="login-version-text">V {{ define.version }}</p>
    </div>
    <div class="login-content">
      <!--        class="login-logo"-->
      <div class="login-logo">
        <!-- <img src="../../assets/images/hg.png" alt=""> -->
        <div class="login-logo-text">
          <span class="text-zh">台账管理系统</span>
        </div>
      </div>
      <div class="login-form">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          autocomplete="on"
          label-position="left"
        >
          <el-form-item prop="account">
            <el-input
              ref="account"
              v-model="loginForm.account"
              placeholder="请输入账号"
              name="account"
              type="text"
              tabindex="1"
              autocomplete="on"
              prefix-icon="el-icon-user"
              size="large"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="大写已锁定" placement="right" manual>
            <el-form-item prop="password">
              <el-input
                ref="password"
                v-model="loginForm.password"
                show-password
                placeholder="请输入密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                prefix-icon="el-icon-lock"
                size="large"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
              />
              <!-- @keyup.enter.native="handleLogin" -->
            </el-form-item>
          </el-tooltip>
          <el-button
            :loading="loading"
            class="login-btn"
            size="large"
            @click.native.prevent="handleLogin"
          >
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        account: '',
        password: ''
      },
      loginRules: {
        account: [
          { required: true, trigger: 'blur', message: '请输入账号' }
        ]
        // password: [
        //   {required: true, trigger: 'blur', message: this.$t('login.passwordTip')}
        // ]
      },
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    const _this = this
    document.onkeydown = function(e) {
      const { keyCode } = e
      if (keyCode === 13) {
        _this.handleLogin()
      }
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    handleLogin() {
      if (this.loading) return
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #000a5f;
  background-size: 100% 100%;

  .login-version {
    position: fixed;
    right: 0px;
    top: 0px;
    width: 82px;
    height: 82px;
    background: url('../../assets/images/login_version.png') no-repeat center;
    background-size: 100%;

    .login-version-text {
      width: 82px;
      height: 82px;
      line-height: 50px;
      text-align: center;
      color: #fff;
      font-size: 16px;
      transform: rotate(45deg);
    }
  }

  .login-content {
    position: absolute;
    right: 5vw;
    bottom: 20vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50vh;
    height: 50vh;
    max-width: 500px;
    min-width: 350px;
    min-height: 350px;
    background-color: #fff;
    flex-shrink: 0;
    border-radius: 5%;

    .sms-input {
      width: 260px;
    }

    .sms-right {
      width: 120px;

      .smsBtn {
        width: 100%;
      }
    }

    .login-logo {
      margin-bottom: 35px;
      display: flex;
      .login-logo-text {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 10px;
        padding: 5px 0;
        .text-zh {
          font-size: 20px;
          letter-spacing: 5px;
        }
      }
    }

    .login-form {
      width: 40vh;
      height: 20vh;
      max-width: 430px;
      min-width: 280px;
      min-height: 140px;
    }

    .login-tab {
      height: 58px;
      margin-bottom: 30px;
      position: relative;
      border-bottom: 1px solid #DCDFE6;

      &::after {
        position: absolute;
        left: 0;
        width: 50%;
        height: 2px;
        content: '';
        display: block;
        bottom: -1px;
        background-color: #1890ff;
        z-index: 100;
        transition: .5s;
      }

      &.active1 {
        &::after {
          left: 0;
        }
      }

      &.active2 {
        &::after {
          left: 50%;
        }
      }

      .item {
        position: relative;
        width: 50%;
        font-size: 20px;
        line-height: 58px;
        color: #666;
        display: inline-block;
        height: 58px;
        text-align: center;

        &.active {
          color: #1890ff;
        }
      }
    }

    .rule-tip {
      color: #a0acb7;
      font-size: 12px;
      line-height: 12px;
      text-align: left;

      :deep(el-form-item__content) {
        line-height: 12px;
      }
    }

    .el-form {
      input:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #606266 !important;
      }

      input::-webkit-input-placeholder {
        color: #a0acb7;
      }

      .login-btn {
        width: 100%;
        font-size: 16px;
        margin-top: 12px;
        background-color: #023672;
        color: #ebebeb;
        &:hover {
          color: #1890ff;
        }
      }

      .foot {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #188ae2;

        .register,
        .forget {
          cursor: pointer;
        }
      }
    }

    .login-form-QRCode {
      width: 100%;
      text-align: center;

      .qrcode-img {
        position: relative;
        margin-bottom: 18px;
        width: 220px;
        height: 220px;
      }

      .qrcode-tip {
        color: #334d65;
        line-height: 22px;
        font-size: 16px;
        text-align: center;
      }
    }
  }

  .login-foot {
    position: absolute;
    width: 1060px;
    color: #999;
    font-size: 12px;
    position: fixed;
    bottom: 20px;
    left: 31%;
    text-align: left;
    margin-left: 110px;
  }
}

</style>
