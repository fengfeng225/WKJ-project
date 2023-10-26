<template>
  <div class="password">
    <div class="title-box">
      <h2 class="bold">修改密码</h2>
    </div>
    <el-row>
      <el-col :span="12">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="dataForm.oldPassword" placeholder="旧密码" show-password />
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="dataForm.password" placeholder="新密码" show-password />
          </el-form-item>
          <el-form-item label="重复密码" prop="password2">
            <el-input v-model="dataForm.password2" placeholder="重复密码" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="dataFormSubmit">保 存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import md5 from 'js-md5'
import { updatePassword } from '@/api/user'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      const passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
      if (value === '') {
        callback(new Error('新密码不能为空'))
      } else if (!passwordreg.test(value)) {
        callback(new Error('密码必须由数字、字母、特殊字符组合,请输入6-16位'))
      } else {
        if (this.dataForm.password2 !== '') {
          this.$refs.dataForm.validateField('password2')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.dataForm.password) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        oldPassword: '',
        password: '',
        password2: ''
      },
      dataRule: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '重复密码不能为空', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const query = {
            oldPassword: md5(this.dataForm.oldPassword),
            password: md5(this.dataForm.password)
          }
          updatePassword(query).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$store.dispatch('user/resetToken').then(() => {
                  this.$router.push(`/login`)
                })
              }
            })
          }).catch(() => {})
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.password {
  ::v-deep .el-input-group__append {
    padding: 0;
    height: 30px;
  }
}
</style>
