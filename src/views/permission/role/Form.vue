<template>
  <el-dialog
    :title="!dataForm.id ? '新增角色' : '编辑角色'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    lock-scroll
    width="600px"
    @close="close"
  >
    <el-form
      ref="dataForm"
      v-loading="formLoading"
      :model="dataForm"
      :rules="dataRule"
      label-width="100px"
    >
      <el-form-item label="角色名称" prop="fullName">
        <el-input v-model="dataForm.fullName" placeholder="请输入角色名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="角色编码" prop="entityCode">
        <el-input v-model="dataForm.entityCode" placeholder="请输入角色编码" />
      </el-form-item>
      <el-form-item label="排序" prop="sortCode">
        <el-input-number
          v-model="dataForm.sortCode"
          :min="0"
          :max="999999"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="状态" prop="enabledMark">
        <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="说明" prop="description">
        <el-input v-model="dataForm.description" type="textarea" :rows="6" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getRoleInfo,
  createRole,
  updateRole
} from '@/api/permission/role'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        id: '',
        fullName: '',
        entityCode: '',
        enabledMark: 1,
        sortCode: 0,
        description: ''
      },
      dataRule: {
        fullName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { max: 50, message: '角色名称最多为50个字符！', trigger: 'blur' }
        ],
        entityCode: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { max: 50, message: '角色编码最多为50个字符！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || ''
      this.visible = true

      if (this.dataForm.id) {
        this.formLoading = true
        getRoleInfo(this.dataForm.id).then(res => {
          this.dataForm = res.data
          this.formLoading = false
        }).catch(() => {
          this.formLoading = false
        })
      }
    },

    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateRole : createRole
          formMethod(this.dataForm).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    },

    close() {
      this.$refs['dataForm'].resetFields()
    }
  }
}
</script>
