<template>
  <div>
    <el-drawer
      ref="drawer"
      :title="dialogTitle"
      :visible.sync="buttonAuthorizeListDrawer"
      :wrapper-closable="false"
      size="700px"
      class="BL-common-drawer"
    >
      <div class="BL-flex-main">
        <div class="BL-common-head">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()" />
          </div>
          <div class="BL-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link
                icon="el-icon-refresh"
                :underline="false"
                @click="getList()"
              />
            </el-tooltip>
          </div>
        </div>
        <BL-table
          v-loading="listLoading"
          :data="treeList"
          row-key="id"
          default-expand-all
          :tree-props="{children: 'children', hasChildren: ''}"
        >
          <el-table-column prop="fullName" label="按钮名称" width="160" />
          <el-table-column prop="entityCode" label="按钮编码" />
          <el-table-column prop="sortCode" label="排序" width="90" align="center" />
          <el-table-column label="状态" width="90">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{ scope.row.enabledMark == 1 ? '正常' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
              <el-button type="text" class="HG-table-delBtn" @click="handleDel(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </BL-table>
      </div>
    </el-drawer>
    <ButtonAuthorizeForm
      v-if="buttonAuthorizeFormVisible"
      ref="ButtonAuthorizeForm"
      @refreshDataList="getList"
    />
  </div>
</template>

<script>
import {
  getButtonAuthorizeList,
  updateButtonState,
  delButton,
  createButton
} from '@/api/system/buttonAuthorize'
import ButtonAuthorizeForm from './Form'

export default {
  components: {
    ButtonAuthorizeForm
  },
  inheritAttrs: false,
  data() {
    return {
      buttonAuthorizeListDrawer: false,
      buttonAuthorizeFormVisible: false,
      dialogTitle: '',
      params: {
        keyword: ''
      },
      moduleId: '',
      loading: false,
      btnLoading: false,
      listLoading: false,
      treeList: [],
      btnList: []
    }
  },

  computed: {
    computedBtnList() {
      return this.btnList
    }
  },

  mounted() {
    this.btnList = [
      { fullName: this.$t('system.buttonAdd'), entityCode: 'btn_add' },
      { fullName: this.$t('system.buttonEdit'), entityCode: 'btn_edit' },
      { fullName: this.$t('system.buttonDetail'), entityCode: 'btn_detail' },
      { fullName: this.$t('system.buttonDelete'), entityCode: 'btn_remove' },
      { fullName: this.$t('system.buttonBulkDelete'), entityCode: 'btn_batchRemove' },
      { fullName: this.$t('system.buttonCopy'), entityCode: 'btn_copy' },
      { fullName: this.$t('system.buttonImport'), entityCode: 'btn_upload' },
      { fullName: this.$t('system.buttonExport'), entityCode: 'btn_download' }
    ]
  },

  methods: {
    init(moduleId, fullName) {
      this.buttonAuthorizeListDrawer = true
      this.moduleId = moduleId
      this.dialogTitle = `${this.$t('system.buttonPermissions')} - ${fullName}`
      this.$nextTick(() => {
        this.params.keyword = ''
        this.getList()
      })
    },
    getList() {
      this.listLoading = true
      getButtonAuthorizeList(this.moduleId, this.params).then(res => {
        this.treeList = res.data.list
        this.listLoading = false
        this.btnLoading = false
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
      })
    },
    handleReLoad() {
      this.btnLoading = true
      this.getList()
    },
    handleUpdateState(row) {
      const txt = row.enabledMark ? '禁用' : '开启'
      this.$confirm(`您确定要${txt}当前按钮权限吗, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        updateButtonState(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              row.enabledMark = row.enabledMark ? 0 : 1
            }
          })
        })
      }).catch(() => { })
    },
    addOrUpdateHandle(id) {
      this.buttonAuthorizeFormVisible = true
      this.$nextTick(() => {
        this.$refs.ButtonAuthorizeForm.init(this.moduleId, id)
      })
    },
    addHandle(item) {
      this.loading = true
      const query = {
        parentId: '-1',
        moduleId: this.moduleId,
        fullName: item.fullName,
        entityCode: item.entityCode,
        sortCode: 0,
        icon: '',
        enabledMark: 1,
        description: ''
      }
      createButton(query).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.getList()
            this.loading = false
          }
        })
      }).catch(() => { this.loading = false })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delButton(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.getList()
            }
          })
        })
      }).catch(() => { })
    }
  }
}
</script>
