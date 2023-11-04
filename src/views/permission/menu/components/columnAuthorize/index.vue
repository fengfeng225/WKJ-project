<template>
  <div>
    <el-drawer
      ref="drawer"
      :title="dialogTitle"
      :visible.sync="columnAuthorizeListDrawer"
      :wrapper-closable="false"
      size="700px"
      class="HG-common-drawer"
    >
      <div class="HG-flex-main">
        <div class="HG-common-head">
          <topOpts @add="addOrUpdateHandle('')">
            <el-button type="text" icon="el-icon-copy-document" @click="handleBatchAdd">
              {{ $t('system.bulkAdditions') }}
            </el-button>
          </topOpts>
          <div class="HG-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.export')" placement="top">
              <el-link
                icon="icon-ym icon-ym-btn-export
              HG-common-head-icon"
                :underline="false"
                @click="exportList()"
              />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link
                icon="icon-ym icon-ym-Refresh
              HG-common-head-icon"
                :underline="false"
                @click="getList()"
              />
            </el-tooltip>
          </div>
        </div>
        <HG-table
          v-loading="listLoading"
          :data="treeList"
          row-key="id"
          default-expand-all
          :tree-props="{children: 'children', hasChildren: ''}"
        >
          <el-table-column prop="entityCode" :label="$t('system.fieldName')" width="160" />
          <el-table-column prop="fullName" :label="$t('system.fieldDescription')" />
          <el-table-column prop="sortCode" :label="$t('system.ordering')" width="90" align="center" />
          <el-table-column :label="$t('system.status')" width="90">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{ scope.row.enabledMark == 1 ? $t('system.statusNormal') : $t('system.statusInactive') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('system.action')" width="100">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)" />
            </template>
          </el-table-column>
        </HG-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('system.closeButton') }}</el-button>
      </span>
    </el-drawer>
    <ColumnAuthorizeForm
      v-if="columnAuthorizeFormVisible"
      ref="ColumnAuthorizeForm"
      @refreshDataList="getList"
    />
    <ColumnAuthorizeBatchForm
      v-if="columnAuthorizeBatchFormVisible"
      ref="ColumnAuthorizeBatchForm"
      @refreshDataList="getList"
    />
    <ColumnExportForm v-if="columnExportFormVisible" ref="ColumnExportForm" />
  </div>
</template>

<script>
import {
  getColumnAuthorizeList,
  updateColumnState,
  delColumn
} from '@/api/system/columnAuthorize'
import ColumnAuthorizeForm from './Form'
import ColumnAuthorizeBatchForm from './BatchForm'
import ColumnExportForm from './ExportForm'

export default {
  components: {
    ColumnAuthorizeForm,
    ColumnAuthorizeBatchForm,
    ColumnExportForm
  },
  data() {
    return {
      columnAuthorizeListDrawer: false,
      columnAuthorizeFormVisible: false,
      columnAuthorizeBatchFormVisible: false,
      columnExportFormVisible: false,
      dialogTitle: '',
      params: {
        keyword: ''
      },
      moduleId: '',
      loading: false,
      btnLoading: false,
      listLoading: false,
      treeList: []
    }
  },
  methods: {
    init(moduleId, fullName) {
      this.columnAuthorizeListDrawer = true
      this.moduleId = moduleId
      this.dialogTitle = `${this.$t('system.listPermissions')} - ${fullName}`
      this.$nextTick(() => {
        this.params.keyword = ''
        this.getList()
      })
    },

    getList() {
      this.listLoading = true
      getColumnAuthorizeList(this.moduleId, this.params).then(res => {
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
      this.$confirm(`您确定要${txt}当前列表权限吗, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        updateColumnState(row.id).then(res => {
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
      this.columnAuthorizeFormVisible = true
      this.$nextTick(() => {
        this.$refs.ColumnAuthorizeForm.init(this.moduleId, id)
      })
    },

    handleBatchAdd() {
      this.columnAuthorizeBatchFormVisible = true
      this.$nextTick(() => {
        this.$refs.ColumnAuthorizeBatchForm.init(this.moduleId)
      })
    },

    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delColumn(id).then(res => {
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
    },

    exportList() {
      this.columnExportFormVisible = true
      this.$nextTick(() => {
        this.$refs.ColumnExportForm.init(this.createDefinition())
      })
    },

    createDefinition() {
      if (this.treeList && this.treeList.length > 0) {
        var definition = '[\r\n'

        for (let i = 0; i < this.treeList.length; i++) {
          var item = this.treeList[i]

          // Opening {
          definition += '  {\r\n'

          definition += `    "fullName": "${item.fullName}",\r\n`
          definition += `    "entityCode": "${item.entityCode}"\r\n`

          // Closing }
          if (i != this.treeList.length - 1) {
            definition += '  },\r\n'
          } else {
            definition += '  }\r\n'
          }
        }

        this.treeList.forEach(item => {
        })

        definition += ']'

        return definition
      }

      return ''
    }
  }
}
</script>
