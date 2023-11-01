<template>
  <el-drawer
    ref="drawer"
    title="字段列表管理"
    :visible.sync="drawer"
    :wrapper-closable="false"
    size="700px"
    class="BL-common-drawer"
    @close="drawerClose"
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
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
            <el-button class="BL-table-delBtn" type="text" @click="handleDel(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </BL-table>

      <DictionaryManage v-if="dictionaryManageVisible" ref="DictionaryManage" @refreshDataList="refreshData" />
    </div>
  </el-drawer>
</template>
<script>
import {
  getDictionaryList,
  deleteDictionary
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
      tableData: [],
      updateDictionary: false
    }
  },
  methods: {
    init() {
      this.drawer = true
      this.getDictionaryList()
    },

    getDictionaryList() {
      this.listLoading = true
      getDictionaryList().then(res => {
        this.tableData = res.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    refreshData() {
      this.updateDictionary = true
      this.getDictionaryList()
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
        deleteDictionary(id).then(res => {
          this.updateDictionary = true
          this.$message({
            type: 'success',
            message: res.message,
            duration: 1500,
            onClose: () => {
              this.getDictionaryList()
            }
          })
        })
      }).catch(() => { })
    },

    reset() {
      this.getDictionaryList()
    },

    drawerClose() {
      if (this.updateDictionary) {
        this.$emit('refreshDataList')
        this.updateDictionary = false
      }
    }
  }
}
</script>
