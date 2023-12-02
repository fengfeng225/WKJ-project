<template>
  <div class="BL-common-layout">
    <div class="BL-common-layout-center BL-flex-main">
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
                icon="icon-ym icon-ym-Refresh BL-common-head-icon"
                :underline="false"
                @click="reset()"
              />
            </el-tooltip>
          </div>
        </div>
        <BL-table v-loading="listLoading" :data="tableData">
          <el-table-column prop="account" label="账号" />
          <el-table-column prop="userName" label="名称" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="dateFormatTable" />
          <el-table-column prop="sortCode" label="排序" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{ scope.row.enabledMark == 1 ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template v-if="!scope.row.isAdministrator" slot-scope="scope">

              <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
              <el-button class="BL-table-delBtn" type="text" @click="handleDel(scope.row.id)">删除</el-button>
              <BL-Dropdown style="margin-left: 8px;">
                <span>
                  <el-button type="text" size="small">更多<i class="el-icon-arrow-down el-icon--right" /></el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleResetPwd(scope.row.id, scope.row.account)">重置密码</el-dropdown-item>
                </el-dropdown-menu>
              </BL-Dropdown>

            </template>
          </el-table-column>
        </BL-table>

        <BL-pagination
          :total="total"
          :page.sync="params.currentPage"
          :limit.sync="params.pageSize"
          @pagination="initData"
        />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <ResetPwdForm v-if="resetFormVisible" ref="ResetPwdForm" @refreshDataList="initData" />
  </div>
</template>
<script>
import {
  getUserList,
  delUser
} from '@/api/permission/user'

import { dateFormatTable } from '@/utils'

import Form from './Form'
import ResetPwdForm from './ResetPassword'

export default {
  name: 'PermissionUser',
  components: {
    Form,
    ResetPwdForm
  },
  data() {
    return {
      tableData: [],
      listLoading: true,
      params: {
        keyword: '',
        currentPage: 1,
        pageSize: 20
      },
      total: 0,
      formVisible: false,
      resetFormVisible: false
    }
  },

  created() {
    this.initData()
  },

  methods: {
    search() {
      this.params.currentPage = 1
      this.params.pageSize = 20
      this.initData()
    },
    reset() {
      this.params.keyword = ''
      this.search()
    },

    initData() {
      this.listLoading = true
      getUserList(this.params).then(res => {
        this.tableData = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false

      if (isRefresh) this.initData()
    },

    handleDel(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        delUser(id).then(res => {
          this.$message({
            type: 'success',
            message: res.message,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },

    handleResetPwd(id, account) {
      this.resetFormVisible = true
      this.$nextTick(() => {
        this.$refs.ResetPwdForm.init(id, account)
      })
    },

    dateFormatTable
  }
}
</script>
