<template>
  <el-dialog
    :title="!dataForm.id ? '新增字段' : '编辑字段'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
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
      label-width="80px"
    >
      <el-form-item label="字段名称" prop="entityCode">
        <el-input v-model="dataForm.entityCode" placeholder="请输入字段名称" />
      </el-form-item>
      <el-form-item label="字段说明" prop="fullName">
        <el-input v-model="dataForm.fullName" placeholder="请输入字段名称" />
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
  createColumn,
  updateColumn,
  getColumnInfo
} from '@/api/system/columnAuthorize'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        id: '',
        moduleId: '',
        fullName: '',
        entityCode: '',
        sortCode: 0,
        enabledMark: 1,
        description: ''
      },
      dataRule: {
        entityCode: [
          { required: true, message: '字段名称不能为空', trigger: 'blur' }
        ],
        fullName: [
          { required: true, message: '字段说明不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(moduleId, id) {
      this.dataForm.id = id || ''
      this.dataForm.moduleId = moduleId
      this.visible = true

      if (this.dataForm.id) {
        this.formLoading = true
        getColumnInfo(this.dataForm.id).then(res => {
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
          const formMethod = this.dataForm.id ? updateColumn : createColumn
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

<style lang="scss" scoped>

</style>

