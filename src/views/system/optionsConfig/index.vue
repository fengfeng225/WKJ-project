<template>
  <div class="BL-common-layout">
    <div class="BL-common-layout-left">
      <div class="BL-common-title">
        <h2>字段</h2>
        <span class="options">
          <el-tooltip content="列表管理" placement="top">
            <el-link icon="el-icon-menu" :underline="false" @click="handleTypeManage" />
          </el-tooltip>
        </span>
      </div>
      <el-scrollbar
        v-loading="treeLoading"
        class="BL-common-el-tree-scrollbar"
        element-loading-text="数据加载中"
      >
        <el-tree
          ref="treeBox"
          :data="treeData"
          :props="defaultProps"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          node-key="id"
          class="BL-common-el-tree"
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ node }" class="custom-tree-node">
            <i class="el-icon-notebook-2" />
            <span class="text">{{ node.label }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="BL-common-layout-center">
      <el-row class="BL-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input
                v-model="params.keyword"
                placeholder="请输入关键词查询"
                clearable
                @keyup.enter.native="search()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="BL-common-layout-main BL-flex-main">
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
      </div>
    </div>

    <OptionDialog v-if="optionDialogVisible" ref="OptionDialog" @refreshDataList="getCurrentOptions" />
    <TypeList v-if="drawer" ref="TypeList" @refreshDataList="initData" />
  </div>
</template>

<script>
import {
  getDictionaryList,
  getOptions,
  deleteOption
} from '@/api/systemData/dictionary'

import OptionDialog from './optionDialog'
import TypeList from './components'

export default {
  name: 'SystemDataDictionary',
  components: {
    OptionDialog,
    TypeList
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      params: {
        keyword: ''
      },
      typeId: '',
      drawer: false,
      optionDialogVisible: false,
      treeLoading: false,
      listLoading: false,
      treeData: [],
      tableData: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    search() {
      this.getCurrentOptions()
    },
    reset() {
      this.params.keyword = ''
      this.getCurrentOptions()
    },
    initData() {
      this.treeLoading = true
      getDictionaryList().then(res => {
        this.treeData = res.data.list
        this.$nextTick(() => {
          if (!this.treeData.length) {
            this.typeId = ''
            this.tableData = []
            this.treeLoading = false
            return
          }
          this.typeId = this.typeId || this.treeData[0].id
          this.$refs.treeBox.setCurrentKey(this.typeId)
          this.treeLoading = false
          this.typeId && this.getCurrentOptions()
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },
    getCurrentOptions() {
      this.listLoading = true
      getOptions(this.typeId, this.params).then(res => {
        this.tableData = res.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 分类管理
    handleTypeManage() {
      this.drawer = true
      this.$nextTick(() => {
        this.$refs.TypeList.init()
      })
    },
    handleNodeClick(data) {
      if (this.typeId === data.id) return
      this.typeId = data.id
      this.reset()
    },

    addOrUpdateHandle(id) {
      this.optionDialogVisible = true
      this.$nextTick(() => {
        this.$refs.OptionDialog.init(id, this.typeId)
      })
    },

    handleDel(id) {
      this.$confirm('您确定要删除该条数据吗?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteOption(id).then(res => {
          this.$message({
            type: 'success',
            message: res.message,
            duration: 1500,
            onClose: () => {
              this.getCurrentOptions()
            }
          })
        })
      }).catch(() => { })
    }
  }
}
</script>
