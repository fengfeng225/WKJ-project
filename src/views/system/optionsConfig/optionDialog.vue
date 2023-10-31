<template>
  <el-dialog
    :title="!dataForm.id ? '新建' : '编辑'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    lock-scroll
    width="600px"
  >
    <el-form
      ref="dataForm"
      v-loading="formLoading"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
    >
      <el-form-item label="名称" prop="fullName">
        <el-input v-model="dataForm.fullName" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="编码" prop="entityCode">
        <el-input v-model="dataForm.entityCode" placeholder="请输入编码" />
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
  getDictionaryDataTypeSelector,
  getDictionaryDataInfo,
  updateDictionaryData,
  createDictionaryData
} from '@/api/systemData/dictionary'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        id: '',
        dictionaryTypeId: '',
        fullName: '',
        entityCode: '',
        description: ''
      },
      dataRule: {
        fullName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 50, message: '字典名称最多为50个字符！', trigger: 'blur' }
        ],
        entityCode: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { max: 150, message: '字典编码最多为150个字符！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id, typeId) {
      this.visible = true
      this.dataForm.id = id || ''
      this.dataForm.dictionaryTypeId = typeId
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        if (this.dataForm.id) {
          getDictionaryDataInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.formLoading = false
          })
        } else {
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateDictionaryData : createDictionaryData
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
