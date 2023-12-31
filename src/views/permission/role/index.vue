<template>
  <div class="BL-common-layout BL-flex-main">
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
                icon="icon-ym icon-ym-Refresh BL-common-head-icon"
                :underline="false"
                @click="initData"
              />
            </el-tooltip>
          </div>
        </div>
        <BL-table v-loading="listLoading" :data="roleList" row-key="id">
          <el-table-column prop="fullName" label="名称" />
          <el-table-column prop="entityCode" label="编码" />
          <el-table-column prop="description" label="说明" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="dateFormatTable" width="150" />
          <el-table-column prop="sortCode" label="排序" width="70" align="center" />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
              <el-button type="text" class="BL-table-delBtn" @click="handleDel(scope.row.id)">删除</el-button>
              <BL-dropdown style="margin-left: 8px;">
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    更多<i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="roleAuthorize(scope.row.id)">角色权限</el-dropdown-item>
                  <el-dropdown-item @click.native="classAuthorize(scope.row.id)">班组权限</el-dropdown-item>
                </el-dropdown-menu>
              </BL-dropdown>
            </template>
          </el-table-column>
        </BL-table>
      </div>

      <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
      <AuthorizeForm v-if="authorizeFormVisible" ref="AuthorizeForm" @close="removeAuthorizeForm" />
      <ClassAuthorize v-if="classAuthorizeVisible" ref="ClassAuthorize" @close="classAuthorizeVisible = false" />
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  delRole
} from '@/api/permission/role'

import { dateFormatTable } from '@/utils'

import Form from './Form'
import AuthorizeForm from './AuthorizeForm'
import ClassAuthorize from './classAuthorize'

export default {
  name: 'PermissionRole',
  components: {
    Form,
    AuthorizeForm,
    ClassAuthorize
  },
  data() {
    return {
      roleList: [],
      params: {
        keyword: ''
      },
      listLoading: true,
      formVisible: false,
      authorizeFormVisible: false,
      classAuthorizeVisible: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    reset() {
      this.params.keyword = ''
      this.search()
    },
    search() {
      this.initData()
    },

    initData() {
      this.listLoading = true
      getRoleList(this.params).then(res => {
        this.roleList = res.data.list
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

    removeAuthorizeForm(isRefresh) {
      this.authorizeFormVisible = false
      if (isRefresh) this.initData()
    },

    handleDel(id) {
      this.$confirm('您确定要删除该条数据吗?', '提示', {
        type: 'warning'
      }).then(() => {
        delRole(id).then(res => {
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

    roleAuthorize(id) {
      this.authorizeFormVisible = true
      this.$nextTick(() => {
        this.$refs.AuthorizeForm.init(id)
      })
    },

    classAuthorize(id) {
      this.classAuthorizeVisible = true
      this.$nextTick(() => {
        this.$refs.ClassAuthorize.init(id)
      })
    },

    dateFormatTable
  }
}
</script>
