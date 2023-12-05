<template>
  <el-dialog
    title="一键检查"
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
      <el-form-item label="班组" prop="className">
        <el-select v-model="dataForm.classId" placeholder="请选择要检查的班组">
          <el-option v-for="item in classList" :key="item.id" :label="item.fullName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="检查人员" prop="inspector">
        <el-input v-model="dataForm.inspector" placeholder="请输入检查人员" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getClasses } from '@/api/bill/mb/bill'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      classList: [],
      dataForm: {
        classId: [],
        inspector: ''
      },
      dataRule: {
        classId: [
          { required: true, message: '请选择要检查的班组', trigger: 'change' }
        ],
        inspector: [
          { required: true, message: '请输入检查人员', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    init(billType) {
      this.visible = true
      this.formLoading = true
      getClasses().then(res => {
        this.dataForm = res.data.list
        this.formLoading = false
      }).catch(() => {
        this.formLoading = false
      })
    },

    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true
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
