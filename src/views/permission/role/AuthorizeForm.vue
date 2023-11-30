<template>
  <transition name="el-zoom-in-center">
    <div class="BL-preview-main authorize-bd">
      <div class="BL-common-page-header">
        <el-page-header content="角色权限" @back="goBack" />
        <div class="options">
          <el-dropdown style="margin-right: 8px">
            <el-button plain>操作<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleCheck('checkAll')">全部勾选</el-dropdown-item>
              <el-dropdown-item @click.native="handleCheck('cancelCheckAll')">取消全选</el-dropdown-item>
              <el-dropdown-item @click.native="setAllExpand('open')">展开所有</el-dropdown-item>
              <el-dropdown-item @click.native="setAllExpand('close')">折叠所有</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button :disabled="active <= 0 || treeLoading" @click="handlePrevStep">上一步</el-button>
          <el-button :disabled="active >= 2 || treeLoading" @click="handleNextStep">下一步</el-button>
          <el-button
            type="primary"
            :loading="btnLoading"
            :disabled="active < 2"
            @click="handleConfirm"
          >确定</el-button>
          <el-button @click="goBack">取消</el-button>
        </div>
      </div>
      <el-steps :active="active" finish-status="success" simple>
        <el-step title="菜单权限" />
        <el-step title="按钮权限" />
        <el-step title="列表权限" />
      </el-steps>
      <div class="main">
        <el-tree
          ref="authorizeTree"
          v-loading="treeLoading"
          :data="authorizeTreeData"
          element-loading-text="数据加载中"
          show-checkbox
          default-expand-all
          node-key="id"
          :check-strictly="checkStrictly"
          check-on-click-node
          :props="defaultProps"
          :expand-on-click-node="false"
          @check-change="selectTreeNodeClick"
        >
          <div slot-scope="{ node, data }">
            <i :class="data.icon" />
            <span style="padding-left: 4px;">{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  getAuthorizeValues,
  updateAuthorizeList
} from '@/api/permission/role'

export default {
  data() {
    return {
      treeLoading: false,
      btnLoading: false,
      checkStrictly: true,
      roleId: null,
      params: {
        type: 'menu',
        menuIds: ''
      },
      active: 0,
      authorizeTreeData: [],
      // menuAuthorizeTree: [],
      // buttonAuthorizeTree: [],
      // columnAuthorizeTree: [],
      menuAllData: [],
      buttonAllData: [],
      columnAllData: [],
      dataForm: {
        menus: [],
        buttons: [],
        columns: []
      },
      menuIdsTemp: [],
      defaultProps: { // 配置项（必选）
        value: 'id',
        label: 'fullName',
        children: 'children'
      }
    }
  },
  methods: {
    init(id) {
      this.roleId = id
      this.getAuthorizeList()
    },

    getAuthorizeList() {
      this.treeLoading = true
      this.authorizeTreeData = []
      getAuthorizeValues(this.roleId, this.params).then(res => {
        switch (this.active) {
          case 0:
            // this.menuAuthorizeTree = res.data.list
            this.menuAllData = res.data.all // 用于全选, 所有id的集合
            this.authorizeTreeData = res.data.list // 渲染树形结构
            this.dataForm.menus = [...new Set([...this.menuIdsTemp, ...res.data.ids])] // 所有选择的菜单id
            this.menuIdsTemp = this.dataForm.menus // 临时存储菜单id
            this.$refs.authorizeTree.setCheckedKeys(this.dataForm.menus) // 勾选
            break
          case 1:
            // this.buttonAuthorizeTree = res.data.list
            this.buttonAllData = res.data.all
            this.authorizeTreeData = res.data.list // 返回菜单和按钮组成的树形结构
            this.dataForm.buttons = [...new Set([...this.dataForm.buttons, ...res.data.ids, ...this.menuIdsTemp])]
            this.$refs.authorizeTree.setCheckedKeys(this.dataForm.buttons)
            break
          case 2:
            // this.columnAuthorizeTree = res.data.list
            this.columnAllData = res.data.all
            this.authorizeTreeData = res.data.list
            this.dataForm.columns = [...new Set([...this.dataForm.columns, ...res.data.ids, ...this.menuIdsTemp])]
            this.$refs.authorizeTree.setCheckedKeys(this.dataForm.columns)
            break
        }
        this.checkStrictly = false
        this.treeLoading = false
      }).catch(() => {
        this.treeLoading = false
      })
    },
    goBack() {
      this.$emit('close')
    },
    // 全选/全不选
    handleCheck(val) {
      if (val === 'checkAll') {
        switch (this.active) {
          case 0:
            this.$refs.authorizeTree.setCheckedKeys(this.menuAllData)
            break
          case 1:
            this.$refs.authorizeTree.setCheckedKeys(this.buttonAllData)
            break
          case 2:
            this.$refs.authorizeTree.setCheckedKeys(this.columnAllData)
            break
        }
      }
      if (val === 'cancelCheckAll') {
        this.$refs.authorizeTree.setCheckedKeys([])
      }
    },
    // 折叠 展开
    setAllExpand(state) {
      let result
      if (state === 'open') {
        result = true
      }
      if (state === 'close') {
        result = false
      }
      const nodes = this.$refs.authorizeTree.store.nodesMap
      for (const i in nodes) {
        nodes[i].expanded = result
      }
    },
    // 上一步
    handlePrevStep() {
      this.active -= 1
      this.handelInitData()
    },
    // 下一步
    handleNextStep() {
      if (this.active++ > 2) this.active = 0
      this.handelInitData()
    },
    handelInitData() {
      this.checkStrictly = true
      switch (this.active) {
        case 0:
          this.params.type = 'menu'
          break
        case 1:
          this.params.type = 'button'
          this.params.menuIds = (this.menuIdsTemp).toString()
          break
        case 2:
          this.params.type = 'column'
          this.params.menuIds = (this.menuIdsTemp).toString()
          break
      }
      this.getAuthorizeList()
    },
    // 设置数据
    selectTreeNodeClick() {
      const parentIds = this.$refs.authorizeTree.getHalfCheckedKeys()
      const childrenIds = this.$refs.authorizeTree.getCheckedKeys()
      const newIds = [...parentIds, ...childrenIds]
      const dataIds = [...new Set(newIds)]
      switch (this.active) {
        case 0:
          this.dataForm.menus = dataIds
          this.menuIdsTemp = this.dataForm.menus
          break
        case 1:
          this.dataForm.buttons = dataIds
          break
        case 2:
          this.dataForm.columns = dataIds
          break
      }
    },
    handleConfirm() {
      this.btnLoading = true
      updateAuthorizeList(this.roleId, this.dataForm).then(res => {
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
  }
}
</script>
<style lang="scss" scoped>
.authorize-bd {
  .BL-common-page-header {
    border-bottom: none;
  }
}
.main {
  padding: 20px;
}
</style>
