<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
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
      <el-form-item label="上级" prop="parentId">
        <BL-TreeSelect
          v-model="dataForm.parentId"
          :options="treeData"
          placeholder="选择上级"
          :disabled="!!dataForm.id"
        />
      </el-form-item>
      <el-form-item label="名称" prop="fullName">
        <el-input v-model="dataForm.fullName" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="排序" prop="sortCode">
        <el-input-number
          v-model="dataForm.sortCode"
          :min="0"
          :max="999999"
          controls-position="right"
        />
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
  createClass,
  updateClass,
  getClassInfo,
  getClassSelector
} from '@/api/bill/class'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      treeData: [],
      dataForm: {
        id: '',
        parentId: '',
        fullName: '',
        sortCode: 0
      },
      dataRule: {
        parentId: [
          { required: true, message: '上级不能为空', trigger: 'change' }
        ],
        fullName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    init(id) {
      this.visible = true
      this.dataForm.id = id || ''

      // 获取上级菜单
      getClassSelector().then(res => {
        const topItem = {
          fullName: '顶级节点',
          hasChildren: true,
          id: '-1',
          children: res.data.list
        }
        this.treeData = [topItem]
      })

      if (this.dataForm.id) {
        this.formLoading = true
        getClassInfo(this.dataForm.id).then(res => {
          res.data.parentId ??= '-1'
          this.dataForm = res.data
          this.formLoading = false
        }).catch(() => {
          this.formLoading = false
        })
      }
    },

    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateClass : createClass
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
