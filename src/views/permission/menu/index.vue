<template>
  <div class="BL-common-layout menu-list">
    <div class="BL-common-layout-center BL-flex-main">
      <el-row class="BL-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input
                v-model="params.keyword"
                placeholder="请输入关键词"
                clearable
                @keyup.enter.native="initData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="initData">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="BL-common-layout-main">
        <div class="box">
          <div class="BL-common-head">
            <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新建</el-button>
            <div class="BL-common-head-right">
              <el-tooltip effect="dark" content="折叠" placement="top">
                <el-link
                  v-show="!expands"
                  type="text"
                  icon="icon-ym icon-ym-btn-expand BL-common-head-icon"
                  :underline="false"
                  @click="toggleExpand"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="折叠" placement="top">
                <el-link
                  v-show="expands"
                  type="text"
                  icon="icon-ym icon-ym-btn-collapse BL-common-head-icon"
                  :underline="false"
                  @click="toggleExpand"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="刷新" placement="top">
                <el-link
                  icon="icon-ym icon-ym-Refresh BL-common-head-icon"
                  :underline="false"
                  @click="reset"
                />
              </el-tooltip>
            </div>
          </div>
          <BL-table
            v-if="refreshTable"
            v-loading="listLoading"
            :data="treeList"
            row-key="id"
            :default-expand-all="expands"
            :tree-props="{children: 'children', hasChildren: ''}"
          >
            <el-table-column label="菜单名称" prop="fullName" width="260" />
            <el-table-column prop="urlAddress" label="菜单地址" show-overflow-tooltip />
            <el-table-column label="图标" prop="icon" width="50" align="center">
              <template slot-scope="scope">
                <i :class="scope.row.icon+' table-icon'" />
              </template>
            </el-table-column>
            <el-table-column label="类型" width="70" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1">目录</span>
                <span v-if="scope.row.type === 2">页面</span>
              </template>
            </el-table-column>
            <el-table-column prop="sortCode" label="排序" width="70" align="center" />
            <el-table-column label="状态" width="70" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.enabledMark === 1 ? 'success' : 'danger'" disable-transitions>
                  {{ scope.row.enabledMark === 1 ? '正常' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
                <el-button type="text" class="BL-table-delBtn" @click="handleDel(scope.row.id)">删除</el-button>
                <template v-if="scope.row.type && scope.row.type !== 1">
                  <BL-dropdown style="margin-left: 8px;">
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        更多<i class="el-icon-arrow-down el-icon--right" />
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <template v-if="scope.row.type === 2">
                        <el-dropdown-item
                          @click.native="handleButtonAuthorize(scope.row)"
                        >
                          按钮权限
                        </el-dropdown-item>
                        <el-dropdown-item
                          @click.native="handleColumnAuthorize(scope.row)"
                        >
                          列表权限
                        </el-dropdown-item>
                      </template>
                    </el-dropdown-menu>
                  </BL-dropdown>
                </template>
              </template>
            </el-table-column>
          </BL-table>
        </div>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
    <ButtonAuthorizeListDrawer v-if="buttonAuthorizeListDrawer" ref="buttonAuthorizeList" />
    <ColumnAuthorizeListDrawer v-if="columnAuthorizeListDrawer" ref="ColumnAuthorizeList" />
  </div>
</template>
<script>
import { getMenuList, delMenu } from '@/api/system/menu'

import Form from './Form'
import ButtonAuthorizeListDrawer from './components/buttonAuthorize'
import ColumnAuthorizeListDrawer from './components/columnAuthorize'

export default {
  name: 'SystemMenu',
  components: {
    Form,
    ButtonAuthorizeListDrawer,
    ColumnAuthorizeListDrawer
  },

  data() {
    return {
      params: {
        keyword: ''
      },
      treeList: [],
      listLoading: true,
      formVisible: false,
      buttonAuthorizeListDrawer: false,
      columnAuthorizeListDrawer: false,
      expands: true,
      refreshTable: true
    }
  },

  created() {
    this.initData()
  },

  methods: {
    reset() {
      this.params.keyword = ''
      this.initData()
    },
    initData() {
      this.listLoading = true
      getMenuList(this.params).then(res => {
        this.treeList = res.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    toggleExpand() {
      this.refreshTable = false
      this.expands = !this.expands
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    },
    handleDel(id) {
      this.$confirm('您确定要删除该条数据吗?', '提示', {
        type: 'warning'
      }).then(() => {
        delMenu(id).then(res => {
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
    handleButtonAuthorize(row) {
      const menuId = row.id
      const fullName = row.fullName
      this.buttonAuthorizeListDrawer = true
      this.$nextTick(() => {
        this.$refs.buttonAuthorizeList.init(menuId, fullName)
      })
    },
    handleColumnAuthorize(row) {
      const menuId = row.id
      const fullName = row.fullName
      this.columnAuthorizeListDrawer = true
      this.$nextTick(() => {
        this.$refs.ColumnAuthorizeList.init(menuId, fullName)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-list {
  .table-icon {
    vertical-align: middle;
    font-size: 16px;
  }

  .BL-common-layout-main {
    padding: 0;
  }

  .box {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
}
</style>
