<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    @close="close"
  >
    <el-form
      ref="dataForm"
      v-loading="formLoading"
      :model="dataForm"
      :rules="dataRule"
      label-width="100px"
    >
      <el-form-item label="名称" prop="label">
        <el-input v-model="dataForm.label" placeholder="请输入名称" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  createGroupCategory,
  updateGroupCategory,
  getGroupCategoryInfo
} from '@/api/billCategory'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        id: '',
        label: '',
        isLeaf: true,
        enabledMark: 1
      },
      dataRule: {
        label: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    init(id) {
      this.visible = true
      this.dataForm.id = id || ''
      this.formLoading = true

      if (this.dataForm.id) {
        getGroupCategoryInfo(this.dataForm.id).then(res => {
          this.dataForm = res.data
          this.formLoading = false
        }).catch(() => {
          this.formLoading = false
        })
      }

      this.formLoading = false
    },

    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateGroupCategory : createGroupCategory
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
      this.$refs.dataForm.resetFields()
    }
  }
}
</script>
