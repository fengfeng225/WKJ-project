<template>
  <transition name="el-zoom-in-center">
    <div class="BL-preview-main user-form">
      <div class="BL-common-page-header">
        <el-page-header
          :content="!dataForm.id ? '新增用户' : '编辑用户'"
          @back="goBack"
        />
        <div class="options">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm">确定</el-button>
          <el-button @click="goBack">取消</el-button>
        </div>
      </div>
      <div v-loading="formLoading" class="main" element-loading-text="数据加载中">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px">
          <div class="BL-common-title BL-20">
            <h2 class="bold">基础信息</h2>
          </div>
          <el-row :gutter="20" class="custom-row">
            <el-col :sm="12" :xs="24">
              <el-form-item label="账户" prop="account">
                <el-input v-model="dataForm.account" placeholder="请输入账户" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="名称" prop="realName">
                <el-input v-model="dataForm.realName" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="角色" prop="roleId">
                <el-select
                  v-model="roleId"
                  multiple
                  placeholder="请选择角色"
                  filterable
                >
                  <el-option
                    v-for="role in roleList"
                    :key="role.id"
                    :label="role.fullName"
                    :value="role.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序" prop="sortCode">
                <el-input-number
                  v-model="dataForm.sortCode"
                  :min="0"
                  :max="999999"
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="enabledMark">
                <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="说明" prop="description">
                <el-input v-model="dataForm.description" type="textarea" :rows="6" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </transition>
</template>
<script>
import { getDepartmentSelector } from '@/api/permission/department'
import { getPositionSelector } from '@/api/permission/position'
import { getRoleSelector } from '@/api/permission/role'
import { createUser, updateUser, getUserInfo } from '@/api/permission/user'
export default {
  data() {
    return {
      btnLoading: false,
      dataForm: {
        id: '',
        sortCode: 0,
        enabledMark: 1,
        account: '',
        realName: '',
        roleId: [],
        description: ''
      },
      roleList: [],
      formLoading: false,
      dataRule: {
        account: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          { max: 50, message: '账户最多为50个字符！', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 50, message: '名称最多为50个字符！', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    getRoleSelector().then(res => {
      this.roleList = res.data.list
    }).catch(() => {})
  },

  methods: {
    init(id) {
      this.dataForm.id = id || ''

      if (this.dataForm.id) {
        this.formLoading = true
        getUserInfo(this.dataForm.id).then(res => {
          this.dataForm = res.data
          this.formLoading = false
        }).catch(() => {
          this.formLoading = false
        })
      }
    },
    goBack() {
      this.$emit('close')
    },

    handleConfirm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateUser : createUser
          formMethod(this.dataForm).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.user-form {
  .main {
    padding: 10px 30px 0;
  }

  ::v-deep .el-select {
    width: 100%;
  }
}
</style>
