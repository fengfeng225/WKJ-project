<template>
  <div class="HG-common-layout menu-list">
    <div class="HG-common-layout-center">
      <el-row class="HG-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item :label="$t('common.keyWord')">
              <el-input
                v-model="params.keyword"
                :placeholder="$t('common.enterKeyword')"
                clearable
                @keyup.enter.native="initData()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="initData()">
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
        <el-tabs v-model="params.category" type="border-card" class="menu-tab">
          <el-tab-pane :label="$t('system.webMenu')" name="Web" />
          <el-tab-pane :label="$t('system.appMenu')" name="App" />
          <div class="box">
            <div class="HG-common-head">
              <topOpts @add="addOrUpdateHandle()">
                <upload-btn url="/api/system/Menu/Action/Import" @on-success="initData" />
              </topOpts>
              <div class="HG-common-head-right">
                <el-tooltip effect="dark" :content="$t('system.unfold')" placement="top">
                  <el-link
                    v-show="!expands"
                    type="text"
                    icon="icon-ym icon-ym-btn-expand HG-common-head-icon"
                    :underline="false"
                    @click="toggleExpand()"
                  />
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('system.fold')" placement="top">
                  <el-link
                    v-show="expands"
                    type="text"
                    icon="icon-ym icon-ym-btn-collapse HG-common-head-icon"
                    :underline="false"
                    @click="toggleExpand()"
                  />
                </el-tooltip>
                <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                  <el-link
                    icon="icon-ym icon-ym-Refresh HG-common-head-icon"
                    :underline="false"
                    @click="reset()"
                  />
                </el-tooltip>
              </div>
            </div>
            <HG-table
              v-if="refreshTable"
              v-loading="listLoading"
              :data="treeList"
              row-key="id"
              :default-expand-all="expands"
              :tree-props="{children: 'children', hasChildren: ''}"
            >
              <el-table-column :label="$t('system.menuName')" prop="fullName" width="260" />
              <el-table-column prop="urlAddress" :label="$t('system.menuAddress')" show-overflow-tooltip />
              <el-table-column :label="$t('system.icon')" prop="icon" width="50" align="center">
                <template slot-scope="scope">
                  <i :class="scope.row.icon+' table-icon'" />
                </template>
              </el-table-column>
              <el-table-column :label="$t('system.type')" width="70" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.type === 1">{{ $t('system.typeList') }}</span>
                  <span v-if="scope.row.type === 2">{{ $t('system.typePage') }}</span>
                  <span v-if="scope.row.type === 3">{{ $t('system.typeFunction') }}</span>
                  <span v-if="scope.row.type === 4">{{ $t('system.typeDictionary') }}</span>
                  <span v-if="scope.row.type === 5">{{ $t('system.typeReport') }}</span>
                  <span v-if="scope.row.type === 6">{{ $t('system.typeLargeScreen') }}</span>
                  <span v-if="scope.row.type === 7">{{ $t('system.typeBacklink') }}</span>
                  <span v-if="scope.row.type === 8">{{ $t('system.typePortal') }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="sortCode" :label="$t('system.ordering')" width="70" align="center" />
              <el-table-column :label="$t('system.status')" width="70" align="center">
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.enabledMark == 1 ? 'success' : 'danger'"
                    disable-transitions
                  >
                    {{ scope.row.enabledMark == 1 ? $t('system.statusNormal') : $t('system.statusInactive') }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column :label="$t('system.action')" width="150">
                <template slot-scope="scope">
                  <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                    <template v-if="scope.row.type && scope.row.type!=1">
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right" />
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <template v-if="[2,3,4].indexOf(scope.row.type)>-1">
                            <el-dropdown-item
                              v-if="params.category==='Web' && scope.row.isButtonAuthorize === 1"
                              @click.native="handleButtonAuthorize(scope.row)"
                            >
                              {{ $t('system.buttonPermissions') }}
                            </el-dropdown-item>
                            <el-dropdown-item
                              v-if="params.category==='Web' && scope.row.isColumnAuthorize === 1"
                              @click.native="handleColumnAuthorize(scope.row)"
                            >
                              {{ $t('system.listPermissions') }}
                            </el-dropdown-item>
                            <el-dropdown-item
                              v-if="params.category==='Web' && scope.row.isFormAuthorize === 1"
                              @click.native="handleFormAuthorize(scope.row)"
                            >
                              {{ $t('system.formPermissions') }}
                            </el-dropdown-item>
                            <el-dropdown-item
                              v-if="scope.row.isDataAuthorize === 1"
                              @click.native="handleDataAuthorize(scope.row)"
                            >
                              {{ $t('system.dataPermissions') }}
                            </el-dropdown-item>
                          </template>
                          <el-dropdown-item @click.native="exportMenu(scope.row.id)">
                            {{ $t('system.exportTemplate') }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </tableOpts>
                </template>
              </el-table-column>
            </HG-table>
          </div>
        </el-tabs>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
    <ButtonAuthorizeListDrawer v-if="buttonAuthorizeListDrawer" ref="buttonAuthorizeList" />
    <ColumnAuthorizeListDrawer v-if="columnAuthorizeListDrawer" ref="ColumnAuthorizeList" />
    <FormAuthorizeListDrawer v-if="formAuthorizeListDrawer" ref="FormAuthorizeList" />
    <DataAuthorizeListDrawer v-if="dataAuthorizeListDrawer" ref="DataAuthorizeList" />
  </div>
</template>
<script>
import { getMenuList, updateMenuState, delMenu, exportMenu } from '@/api/system/menu'
import Form from './Form'
import ButtonAuthorizeListDrawer from './components/buttonAuthorize/index'
import ColumnAuthorizeListDrawer from './components/columnAuthorize/index'
import FormAuthorizeListDrawer from './components/formAuthorize/index'
import DataAuthorizeListDrawer from './components/dataAuthorize/index'

export default {
  name: 'SystemMenu',
  components: {
    Form,
    ButtonAuthorizeListDrawer,
    ColumnAuthorizeListDrawer,
    FormAuthorizeListDrawer,
    DataAuthorizeListDrawer
  },
  data() {
    return {
      options: [],
      params: {
        keyword: '',
        category: 'Web'
      },
      treeList: [],
      btnLoading: false,
      listLoading: true,
      formVisible: false,
      buttonAuthorizeListDrawer: false,
      columnAuthorizeListDrawer: false,
      formAuthorizeListDrawer: false,
      dataAuthorizeListDrawer: false,
      expands: true,
      refreshTable: true
    }
  },
  watch: {
    'params.category': function(val) {
      this.reset()
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
        this.btnLoading = false
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
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
        this.$refs.Form.init(id, this.params.category)
      })
    },
    handleUpdateState(row) {
      const txt = row.enabledMark ? '禁用' : '开启'
      this.$confirm(`您确定要${txt}当前菜单吗, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        updateMenuState(row.id).then(res => {
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
        delMenu(id).then(res => {
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
    handleButtonAuthorize(row) {
      const moduleId = row.id
      const fullName = row.fullName
      this.buttonAuthorizeListDrawer = true
      this.$nextTick(() => {
        this.$refs.buttonAuthorizeList.init(moduleId, fullName)
      })
    },
    handleColumnAuthorize(row) {
      const moduleId = row.id
      const fullName = row.fullName
      this.columnAuthorizeListDrawer = true
      this.$nextTick(() => {
        this.$refs.ColumnAuthorizeList.init(moduleId, fullName)
      })
    },
    handleFormAuthorize(row) {
      const moduleId = row.id
      const fullName = row.fullName
      this.formAuthorizeListDrawer = true
      this.$nextTick(() => {
        this.$refs.FormAuthorizeList.init(moduleId, fullName)
      })
    },
    handleDataAuthorize(row) {
      const moduleId = row.id
      const fullName = row.fullName
      this.dataAuthorizeListDrawer = true
      this.$nextTick(() => {
        this.$refs.DataAuthorizeList.init(moduleId, fullName)
      })
    },
    exportMenu(id) {
      this.$confirm('您确定要导出该菜单, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportMenu(id).then(res => {
          if (res.data.url) window.location.href = this.define.comUrl + res.data.url
        })
      }).catch(() => { })
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

    .HG-common-layout-main {
      padding: 0;
    }

    .menu-tab {
      height: 100%;

      :deep(.el-tabs__content) {
        padding: 0;
        height: calc(100% - 40px);

        .box {
          flex: 1;
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding-bottom: 10px;
        }
      }
    }
  }
</style>
