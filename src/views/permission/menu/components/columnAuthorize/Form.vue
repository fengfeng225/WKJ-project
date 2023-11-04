<template>
  <el-dialog
    :title="!dataForm.id ? $t('system.createField') : $t('system.editField')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    lock-scroll
    class="HG-dialog HG-dialog_center"
    width="600px"
  >
    <el-form
      ref="dataForm"
      v-loading="formLoading"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      class="menuForm"
    >
      <!--      <el-form-item label="绑定表格" prop="bindTable">-->
      <!--        <el-input v-model="dataForm.bindTable" placeholder="输入绑定表格" />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="表格描述" prop="bindTableName">-->
      <!--        <el-input v-model="dataForm.bindTableName" placeholder="绑定表格描述" />-->
      <!--      </el-form-item>-->
      <el-form-item :label="$t('system.fieldName')" prop="entityCode">
        <el-input v-model="dataForm.entityCode" :placeholder="$t('system.fieldNameHint')" />
      </el-form-item>
      <el-form-item :label="$t('system.fieldDescription')" prop="fullName">
        <el-input v-model="dataForm.fullName" :placeholder="$t('system.fieldDescriptionHint')" />
      </el-form-item>
      <el-form-item :label="$t('system.ordering')" prop="sortCode">
        <el-input-number
          v-model="dataForm.sortCode"
          :min="0"
          :max="999999"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item :label="$t('system.status')" prop="enabledMark">
        <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item :label="$t('system.description')" prop="description">
        <el-input v-model="dataForm.description" type="textarea" :rows="6" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        {{ $t('common.confirmButton') }}
      </el-button>
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
        bindTable: '',
        bindTableName: '',
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
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        // 获取字段数据
        if (this.dataForm.id) {
          getColumnInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
          })
        }
        this.formLoading = false
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateColumn : createColumn
          formMethod(this.dataForm).then(res => {
            this.$message({
              message: res.msg,
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

