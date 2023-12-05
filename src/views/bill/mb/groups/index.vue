<template>
  <div class="BL-common-layout">

    <!-- right -->
    <div class="BL-common-layout-center BL-flex-main">
      <el-row class="BL-common-search-box">
        <div style="display: flex; justify-content: space-between; padding: 5px;">
          <div />
          <div>
            <el-button v-if="hasRoleButton('btn_add')" icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">新建</el-button>
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link
                style="margin-left: 12px;"
                icon="el-icon-refresh"
                :underline="false"
                @click="refresh"
              />
            </el-tooltip>
          </div>
        </div>
      </el-row>

      <div class="BL-common-layout-main BL-flex-main">
        <BL-table ref="BLTable" v-loading="tableLoading" :data="tableData" row-key="id">
          <template v-for="item in computedRoleColumnOptions">
            <template v-if="item.prop === 'action'">
              <ex-table-column v-if="hasRoleButton(['btn_edit', 'btn_delete'])" :key="item.prop" :label="item.label" width="120" fixed="right">
                <template #default="scope">
                  <el-button v-if="hasRoleButton('btn_edit')" type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
                  <el-button v-if="hasRoleButton('btn_delete')" class="BL-table-delBtn" type="text" @click="removeHandle(scope.row.id)">删除</el-button>
                  <!-- <BL-Dropdown style="margin-left: 8px;">
                    <span>
                      <el-button type="text" size="small">更多<i class="el-icon-arrow-down el-icon--right" /></el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>其他</el-dropdown-item>
                    </el-dropdown-menu>
                  </BL-Dropdown> -->
                </template>
              </ex-table-column>
            </template>
            <template v-else-if="item.prop === 'creatorTime'">
              <ex-table-column :key="item.prop" :label="item.label" :prop="item.prop" :formatter="dateFormatTable" />
            </template>
            <template v-else>
              <ex-table-column :key="item.prop" :label="item.label" :prop="item.prop" />
            </template>
          </template>
        </BL-table>
      </div>
    </div>

    <GroupDialog v-if="groupDialogVisible" ref="GroupDialog" @refreshDataList="refresh" />
  </div>
</template>

<script>
import { getGroupCategories, deleteGroupCategory } from '@/api/bill/mb/class'
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
      groupDialogVisible: false,
      roleButtonOptions: ['btn_add', 'btn_edit', 'btn_delete'],
      roleColumnOptions: [
        {
          label: '名称',
          prop: 'label'
        },
        {
          label: '排序',
          prop: 'sortCode'
        },
        {
          label: '创建时间',
          prop: 'creatorTime'
        },
        {
          label: '操作',
          prop: 'action'
        }
      ]
    }
  },

  computed: {
    computedRoleColumnOptions() {
      this.setPermissions()

      return this.roleColumnOptions
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

    setPermissions() {
      // Get the list with all the user permissions from the store.
      const permissionList = this.$store.getters.permissionList

      // Retrieve the model ID based from the route.
      const menuId = this.$route.meta.menuId

      // Filter the user permission with the model and get only permissions for this page.
      const list = permissionList.filter(o => o.id === menuId)

      // Get the permissions for this module and check for column permissions.
      const columnList = list[0] && list[0].columns ? list[0].columns : []

      const permissionColumnList = []

      for (let i = 0; i < this.roleColumnOptions.length; i++) {
        // Create an inner look and assign a name to the loop.
        for (let j = 0; j < columnList.length; j++) {
          // If the column name in the page is in the list with user permissions add it to the visible list.
          if (this.roleColumnOptions[i].prop === columnList[j].entityCode) {
            permissionColumnList.push(this.roleColumnOptions[i])

            // We have found a match, break the inner loop and go to the outer loop for next item.
            break
          }
        }
      }

      // Assign the columns for this page with the filtered columns for the current user.
      this.roleColumnOptions = permissionColumnList

      // Get the permissions for this module and check for button permissions.
      const buttonList = list[0] && list[0].buttons ? list[0].buttons : []

      const permissionButtonList = []

      for (let i = 0; i < this.roleButtonOptions.length; i++) {
        for (let j = 0; j < buttonList.length; j++) {
          if (this.roleButtonOptions[i] === buttonList[j].entityCode) {
            permissionButtonList.push(this.roleButtonOptions[i])
            break
          }
        }
      }

      this.roleButtonOptions = permissionButtonList
    },

    hasRoleButton(code) {
      if (Array.isArray(code)) {
        for (const item of code) {
          if (this.roleButtonOptions.indexOf(item) > -1) {
            return true
          }
        }

        return false
      } else {
        return this.roleButtonOptions.indexOf(code) > -1
      }
    },

    dateFormatTable
  }
}
</script>

<style>

</style>
