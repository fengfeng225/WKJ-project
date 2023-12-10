<template>
  <el-dialog
    title="班组授权"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    @close="close"
  >
    <el-tree
      ref="authorizeTree"
      v-loading="treeLoading"
      :data="authorizeTreeData"
      element-loading-text="数据加载中"
      show-checkbox
      default-expand-all
      node-key="id"
      check-on-click-node
      :props="defaultProps"
      :expand-on-click-node="false"
      @check-change="selectTreeNodeClick"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getClassAuthorize,
  updateClassAuthorize
} from '@/api/permission/role'

export default {
  data() {
    return {
      visible: false,
      treeLoading: false,
      btnLoading: false,
      authorizeTreeData: [],
      roleId: '',
      dataForm: {
        classIds: []
      },
      defaultProps: {
        value: 'id',
        label: 'fullName',
        children: 'children'
      }
    }
  },

  methods: {
    init(id) {
      this.roleId = id
      this.visible = true
      this.treeLoading = true
      getClassAuthorize(id).then(res => {
        this.authorizeTreeData = res.data.list
        this.dataForm.classIds = res.data.ids
        this.$refs.authorizeTree.setCheckedKeys(res.data.ids)
        this.treeLoading = false
      }).catch(() => {
        this.treeLoading = false
      })
    },

    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true
          updateClassAuthorize(this.roleId, this.dataForm).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    },

    selectTreeNodeClick() {
      const parentIds = this.$refs.authorizeTree.getHalfCheckedKeys()
      const childrenIds = this.$refs.authorizeTree.getCheckedKeys()
      const newIds = [...parentIds, ...childrenIds]
      const dataIds = [...new Set(newIds)]
      this.dataForm.classIds = dataIds
    },

    close() {
      this.$refs.dataForm.resetFields()
    }
  }
}
</script>
