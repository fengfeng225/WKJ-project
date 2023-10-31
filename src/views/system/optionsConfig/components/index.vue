<template>
  <el-drawer
    ref="drawer"
    title="分类管理"
    :visible.sync="drawer"
    :wrapper-closable="false"
    size="700px"
    :before-close="handleDrawerClose"
    class="BL-common-drawer"
  >
    <div class="BL-flex-main">
      <div class="BL-common-head">
        <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新建</el-button>
        <div class="BL-common-head-right">
          <el-tooltip effect="dark" content="刷新" placement="top">
            <el-link
              style="margin-left: 12px;"
              icon="el-icon-refresh"
              :underline="false"
              @click="reset"
            />
          </el-tooltip>
        </div>
      </div>
      <BL-table
        v-loading="listLoading"
        :data="tableData"
        row-key="id"
      >
        <el-table-column prop="fullName" label="名称" />
        <el-table-column prop="entityCode" label="编码" />
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
            <el-button class="BL-table-delBtn" type="text" @click="handleDel(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </BL-table>

      <DictionaryManage v-if="dictionaryManageVisible" ref="DictionaryManage" @refreshDataList="getDictionaryTypeList" />
    </div>
  </el-drawer>
</template>
<script>
import {
  getDictionaryType,
  delDictionaryType,
  exportData
} from '@/api/systemData/dictionary'

import DictionaryManage from './dictionaryManage'

export default {
  components: {
    DictionaryManage
  },
  data() {
    return {
      drawer: false,
      listLoading: false,
      btnLoading: false,
      dictionaryManageVisible: false,
      tableData: []
    }
  },
  methods: {
    init() {
      this.drawer = true
      this.getDictionaryTypeList()
    },
    getDictionaryTypeList() {
      this.listLoading = true
      getDictionaryType().then(res => {
        this.tableData = res.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    addOrUpdateHandle(id) {
      this.dictionaryManageVisible = true
      this.$nextTick(() => {
        this.$refs.DictionaryManage.init(id)
      })
    },
    handleDel(id) {
      this.$confirm('您确定要删除该条数据吗?', '提示', {
        type: 'warning'
      }).then(() => {
        delDictionaryType(id).then(res => {
          this.$message({
            type: 'success',
            message: res.message,
            duration: 1500,
            onClose: () => {
              this.getDictionaryTypeList()
            }
          })
        })
      }).catch(() => { })
    },
    reset() {
      this.getDictionaryTypeList()
    },
    handleDrawerClose(done) {
      done()
      this.$emit('refreshDataList')
    }
  }
}
</script>
