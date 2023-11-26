<template>
  <div>
    <el-drawer
      ref="drawer"
      :title="dialogTitle"
      :visible.sync="columnAuthorizeListDrawer"
      :wrapper-closable="false"
      size="700px"
      class="BL-common-drawer"
    >
      <div class="BL-flex-main">
        <div class="BL-common-head">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
            <el-button type="text" icon="el-icon-copy-document" @click="handleBatchAdd">批量新增</el-button>
          </div>
          <div class="BL-common-head-right">
            <el-tooltip effect="dark" content="导出" placement="top">
              <el-link
                icon="icon-ym icon-ym-btn-export BL-common-head-icon"
                :underline="false"
                @click="exportList"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link
                icon="el-icon-refresh"
                :underline="false"
                @click="getList"
              />
            </el-tooltip>
          </div>
        </div>
        <BL-table
          v-loading="listLoading"
          :data="columnList"
          row-key="id"
        >
          <el-table-column prop="fullName" label="字段名称" />
          <el-table-column prop="entityCode" label="字段编码" width="160" />
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
              <el-button type="text" class="BL-table-delBtn" @click="handleDel(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </BL-table>
      </div>
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
      menuId: null,
      listLoading: false,
      columnList: []
    }
  },
  methods: {
    init(menuId, fullName) {
      this.columnAuthorizeListDrawer = true
      this.menuId = menuId
      this.dialogTitle = `列表权限 - ${fullName}`
      this.getList()
    },

    getList() {
      this.listLoading = true
      getColumnAuthorizeList(this.menuId).then(res => {
        this.columnList = res.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    addOrUpdateHandle(id) {
      this.columnAuthorizeFormVisible = true
      this.$nextTick(() => {
        this.$refs.ColumnAuthorizeForm.init(this.menuId, id)
      })
    },

    handleBatchAdd() {
      this.columnAuthorizeBatchFormVisible = true
      this.$nextTick(() => {
        this.$refs.ColumnAuthorizeBatchForm.init(this.menuId)
      })
    },

    handleDel(id) {
      this.$confirm('您确定要删除该条数据吗?', '提示', {
        type: 'warning'
      }).then(() => {
        delColumn(id).then(res => {
          this.$message({
            type: 'success',
            message: res.message,
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
      if (this.columnList && this.columnList.length > 0) {
        var definition = '[\r\n'

        for (let i = 0; i < this.columnList.length; i++) {
          var item = this.columnList[i]

          // Opening {
          definition += '  {\r\n'

          definition += `    "fullName": "${item.fullName}",\r\n`
          definition += `    "entityCode": "${item.entityCode}"\r\n`

          // Closing }
          if (i != this.columnList.length - 1) {
            definition += '  },\r\n'
          } else {
            definition += '  }\r\n'
          }
        }

        definition += ']'

        return definition
      }

      return ''
    }
  }
}
</script>
