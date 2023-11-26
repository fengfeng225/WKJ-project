<template>
  <div class="BL-common-layout">

    <!-- right -->
    <div class="BL-common-layout-center BL-flex-main">
      <el-row class="BL-common-search-box">
        <div style="display: flex; justify-content: space-between; padding: 5px;">
          <el-button icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">新建</el-button>
          <el-tooltip effect="dark" content="刷新" placement="top">
            <el-link
              style="margin-left: 12px;"
              icon="el-icon-refresh"
              :underline="false"
              @click="refresh"
            />
          </el-tooltip>
        </div>
      </el-row>

      <div class="BL-common-layout-main BL-flex-main">
        <BL-table ref="BLTable" v-loading="tableLoading" :data="tableData" row-key="id">
          <el-table-column label="名称" prop="label" />
          <el-table-column label="创建时间" prop="creatorTime" :formatter="dateFormatTable" />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <template v-if="!!scope.row.parentId">
                <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
                <el-button class="BL-table-delBtn" type="text" @click="removeHandle(scope.row.id)">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </BL-table>
      </div>
    </div>

    <GroupDialog v-if="groupDialogVisible" ref="GroupDialog" @refreshDataList="refresh" />
  </div>
</template>

<script>
import { getGroupCategories, deleteGroupCategory } from '@/api/bill/mb/group'
import { dateFormatTable } from '@/utils'

import GroupDialog from './GroupDialog'

export default {
  name: 'Groups',

  components: {
    GroupDialog
  },

  data() {
    return {
      tableLoading: false,
      tableData: [],
      groupDialogVisible: false
    }
  },

  created() {
    this.initData()
  },

  methods: {
    initData() {
      this.tableLoading = true
      getGroupCategories().then(res => {
        this.tableData = res.data.list
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },

    refresh() {
      this.initData()
    },

    addOrUpdateHandle(id) {
      this.groupDialogVisible = true
      this.$nextTick(() => {
        this.$refs.GroupDialog.init(id)
      })
    },

    removeHandle(id) {
      this.$confirm('您确定要删除该班吗?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteGroupCategory(id).then(res => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },

    dateFormatTable
  }
}
</script>

<style>

</style>
