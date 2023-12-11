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
      <el-form-item label="班组" prop="classIds">
        <BL-TreeSelect
          v-model="dataForm.classIds"
          :options="treeData"
          placeholder="请选择要检查的班组"
          multiple
          check-half-nodes
        />
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
import { getClassBasic, checkAll } from '@/api/bill/class'

export default {
  props: {
    roleClassList: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      treeData: [],
      dataForm: {
        classIds: '',
        inspector: '',
        type: ''
      },
      dataRule: {
        classIds: [
          { required: true, message: '请选择要检查的班组', trigger: 'input' }
        ],
        inspector: [
          { required: true, message: '请输入检查人员', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    roleClassIds() {
      return this.roleClassList.map(item => item.id)
    }
  },

  methods: {
    init(type) {
      this.dataForm.type = type
      this.visible = true
      this.formLoading = true
      getClassBasic().then(res => {
        this.initDisabledTreeNode(res.data.list)
        this.treeData = res.data.list
        this.formLoading = false
      }).catch(() => {
        this.formLoading = false
      })
    },

    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true
          checkAll(this.dataForm).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close')
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    },

    close() {
      this.$emit('close')
    },

    initDisabledTreeNode(treeData) {
      treeData.forEach(item => {
        if (!this.roleClassIds.includes(item.id)) item.disabled = true
        if (item.children?.length) this.initDisabledTreeNode(item.children)
      })
    }
  }
}
</script>
