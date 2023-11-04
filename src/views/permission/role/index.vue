<template>
  <div class="HG-common-layout HG-flex-main">
    <div class="HG-common-layout-center">
      <el-row class="HG-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item :label="$t('common.keyWord')">
              <el-input
                v-model="keyword"
                :placeholder="$t('common.enterKeyword')"
                clearable
                @keyup.enter.native="search()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('permission.roleType')">
              <el-select v-model="category" :placeholder="$t('permission.roleTypeHint')" clearable>
                <el-option
                  v-for="item in categoryList"
                  :key="item.entityCode"
                  :label="item.fullName"
                  :value="item.entityCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">
                {{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="HG-common-layout-main HG-flex-main">
        <div class="HG-common-head">
          <topOpts @add="addOrUpdateHandle()" />
          <div class="HG-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link
                icon="icon-ym icon-ym-Refresh HG-common-head-icon"
                :underline="false"
                @click="initData()"
              />
            </el-tooltip>
          </div>
        </div>
        <HG-table v-loading="listLoading" :data="list" row-key="id" :tree-props="{children: 'children', hasChildren: ''}">
          <el-table-column prop="fullName" :label="$t('permission.name')" />
          <el-table-column prop="entityCode" :label="$t('permission.code')" />
          <el-table-column prop="type" :label="$t('permission.type')" width="150" />
          <el-table-column prop="description" :label="$t('permission.description')" />
          <el-table-column
            prop="creatorTime"
            :label="$t('permission.createdTime')"
            :formatter="hg.tableDateFormat"
            width="120"
          />
          <el-table-column prop="sortCode" :label="$t('permission.ordering')" width="70" align="center" />
          <el-table-column :label="$t('permission.status')" width="70" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{ scope.row.enabledMark == 1 ? $t('permission.statusNormal') : $t('permission.statusInactive') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('permission.action')" width="150">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <HG-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, scope.row.fullName)">
                      {{ $t('role.roleMember') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleAuthorize(scope.row.id, scope.row.fullName)">
                      {{ $t('role.rolePermission') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleTargetAuthorize(scope.row.id, scope.row.fullName)">
                      {{ $t('edgeAdmin.targetPermission') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleAcquisitionAuthorize(scope.row.id, scope.row.fullName)">
                      {{ $t('edgeAdmin.acquisitionPermission') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleAlgorithmsAuthorize(scope.row.id, scope.row.fullName)">
                      {{ $t('edgeAdmin.algorithmPermission') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </HG-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </HG-table>
        <!--<pagination :total="total" :page.sync="listQuery.currentPage"
                    :limit.sync="listQuery.pageSize" @pagination="initData" />-->
      </div>
      <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
      <AuthorizeForm v-if="authorizeFormVisible" ref="AuthorizeForm" @close="removeAuthorizeForm" />
      <TargetAuthorizeForm v-if="targetAuthorizeFormVisible" ref="TargetAuthorizeForm" @close="removeTargetAuthorizeForm" />
      <AcquisitionAuthorizeForm v-if="acquisitionAuthorizeFormVisible" ref="AcquisitionAuthorizeForm" @close="removeAcquisitionAuthorizeForm" />
      <AlgorithmAuthorizeForm v-if="algorithmAuthorizeFormVisible" ref="AlgorithmAuthorizeForm" @close="removeAlgorithmAuthorizeForm" />
      <UserRelationList
        v-if="userRelationListVisible"
        ref="UserRelationList"
        @refreshDataList="initData"
      />
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  delRole,
  getRoleTypeSelector,
  updateRoleState
} from '@/api/permission/role'
import Form from './Form'
import AuthorizeForm from '@/views/permission/authorize/AuthorizeForm'
import TargetAuthorizeForm from '@/views/edgeAdmin/targetsAuthorize/TargetAuthorizeForm'
import AcquisitionAuthorizeForm from '@/views/edgeAdmin/acquisitionsAuthorize/AcquisitionAuthorizeForm'
import AlgorithmAuthorizeForm from '@/views/edgeAdmin/algorithmsAuthorize/AlgorithmAuthorizeForm'
import UserRelationList from '@/views/permission/userRelation/Selector'

export default {
  name: 'PermissionRole',
  components: {
    Form,
    AuthorizeForm,
    TargetAuthorizeForm,
    AcquisitionAuthorizeForm,
    AlgorithmAuthorizeForm,
    UserRelationList
  },
  data() {
    return {
      list: [],
      categoryList: [],
      keyword: '',
      category: '',
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      total: 0,
      listLoading: true,
      formVisible: false,
      authorizeFormVisible: false,
      targetAuthorizeFormVisible: false,
      acquisitionAuthorizeFormVisible: false,
      algorithmAuthorizeFormVisible: false,
      userRelationListVisible: false
    }
  },
  created() {
    this.getDictionaryData()
    this.initData()
  },
  methods: {
    reset() {
      this.keyword = ''
      this.category = ''
      this.search()
    },
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      }
      this.initData()
    },
    initData() {
      this.listLoading = true
      const query = {
        ...this.listQuery,
        keyword: this.keyword,
        category: this.category
      }
      getRoleList(query).then(res => {
        this.list = res.data.list
        // this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getDictionaryData() {
      getRoleTypeSelector().then(res => {
        this.categoryList = res.data.list
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
      if (isRefresh) {
        this.initData()
      }
    },
    removeTargetAuthorizeForm(isRefresh) {
      this.targetAuthorizeFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    removeAcquisitionAuthorizeForm(isRefresh) {
      this.acquisitionAuthorizeFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    removeAlgorithmAuthorizeForm(isRefresh) {
      this.algorithmAuthorizeFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    removeUserRelationList(isRefresh) {
      this.userRelationListVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    handleUpdateState(row) {
      const txt = row.enabledMark ? '禁用' : '开启'
      this.$confirm(`您确定要${txt}当前角色吗, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        updateRoleState(row.id).then(res => {
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
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delRole(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, fullName) {
      this.userRelationListVisible = true
      this.$nextTick(() => {
        this.$refs.UserRelationList.init(id, fullName, 'Role')
      })
    },
    handleAuthorize(id, fullName) {
      this.authorizeFormVisible = true
      this.$nextTick(() => {
        this.$refs.AuthorizeForm.init(id, fullName, 'Role')
      })
    },
    handleTargetAuthorize(id, fullName) {
      this.targetAuthorizeFormVisible = true
      this.$nextTick(() => {
        this.$refs.TargetAuthorizeForm.init(id, fullName, 'Role')
      })
    },
    handleAcquisitionAuthorize(id, fullName) {
      this.acquisitionAuthorizeFormVisible = true
      this.$nextTick(() => {
        this.$refs.AcquisitionAuthorizeForm.init(id, fullName, 'Role')
      })
    },
    handleAlgorithmsAuthorize(id, fullName) {
      this.algorithmAuthorizeFormVisible = true
      this.$nextTick(() => {
        this.$refs.AlgorithmAuthorizeForm.init(id, fullName, 'Role')
      })
    }
  }
}
</script>
