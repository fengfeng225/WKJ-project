<template>
  <div>
    <el-drawer
      ref="drawer"
      :title="dialogTitle"
      :visible.sync="dataAuthorizeListDrawer"
      :wrapper-closable="false"
      size="700px"
      class="HG-common-drawer"
    >
      <div class="HG-flex-main">
        <el-tabs
          v-model="tabActiveName"
          type="border-card"
          class="HG-flex-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane :label="$t('system.scenarioManagement')" name="dataAuthorizeScheme">
            <div class="HG-common-head">
              <topOpts @add="addOrUpdateHandle('')" />
              <div class="HG-common-head-right">
                <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                  <el-link
                    icon="icon-ym icon-ym-Refresh
                  HG-common-head-icon"
                    :underline="false"
                    @click="getAuthorizeSchemeList()"
                  />
                </el-tooltip>
              </div>
            </div>
            <HG-table
              v-loading="listLoading"
              :data="dataAuthorizeSchemeList"
              row-key="id"
              default-expand-all
              :tree-props="{children: 'children', hasChildren: ''}"
            >
              <el-table-column prop="fullName" :label="$t('system.scenarioName')" width="160" />
              <el-table-column prop="conditionText" :label="$t('system.filterCriteria')" />
              <el-table-column :label="$t('common.action')" width="100">
                <template slot-scope="scope">
                  <tableOpts
                    @edit="addOrUpdateHandle(scope.row.id)"
                    @del="handleDel(scope.row.id)"
                  />
                </template>
              </el-table-column>
            </HG-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('system.fieldManagement')" name="dataAuthorize">
            <div class="HG-common-head">
              <topOpts @add="addOrUpdateHandle('')" />
              <div class="HG-common-head-right">
                <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                  <el-link
                    icon="icon-ym icon-ym-Refresh
                  HG-common-head-icon"
                    :underline="false"
                    @click="getAuthorizeList()"
                  />
                </el-tooltip>
              </div>
            </div>
            <HG-table
              v-loading="dataListLoading"
              :data="dataAuthorizeList"
              row-key="id"
              default-expand-all
              :tree-props="{children: 'children', hasChildren: ''}"
            >
              <el-table-column prop="entityCode" :label="$t('system.fieldName')" />
              <el-table-column prop="fullName" :label="$t('system.fieldDescription')" show-overflow-tooltip />
              <el-table-column prop="type" :label="$t('system.fieldType')" width="70" />
              <el-table-column prop="conditionSymbol" :label="$t('system.conditionalSymbol')" show-overflow-tooltip />
              <el-table-column :label="$t('system.conditionalContent')" width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.conditionText === 'text'">{{ $t('system.arbitraryText') }}</span>
                  <span v-if="scope.row.conditionText === '@userId'">{{ $t('system.currentUser') }}</span>
                  <span v-if="scope.row.conditionText === '@organizeId'">{{ $t('system.currentOrganization') }}</span>
                  <span v-if="scope.row.conditionText === '@organizationAndSuborganization'">{{ $t('system.currentOrganizationAndSub') }}</span>
                  <span v-if="scope.row.conditionText === '@userAraSubordinates'">{{ $t('system.currentUserAndSub') }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('system.action')" width="100">
                <template slot-scope="scope">
                  <tableOpts
                    @edit="addOrUpdateHandle(scope.row.id)"
                    @del="handleDel(scope.row.id)"
                  />
                </template>
              </el-table-column>
            </HG-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('system.closeButton') }}</el-button>
      </span>
    </el-drawer>
    <DataSchemeForm
      v-if="dataSchemeFormVisible"
      ref="DataSchemeForm"
      @refreshDataList="getAuthorizeSchemeList"
    />
    <DataAuthorizeForm
      v-if="dataAuthorizeFormVisible"
      ref="DataAuthorizeForm"
      @refreshDataList="getAuthorizeList"
    />
  </div>
</template>

<script>
import {
  getDataAuthorizeSchemeList,
  getDataAuthorizeList,
  delDataScheme,
  delDataAuthorize
} from '@/api/system/dataAuthorize'
import DataSchemeForm from './DataSchemeForm'
import DataAuthorizeForm from './DataAuthorizeForm'

export default {
  components: {
    DataSchemeForm,
    DataAuthorizeForm
  },
  data() {
    return {
      tabActiveName: 'dataAuthorizeScheme',
      dataAuthorizeListDrawer: false,
      dialogTitle: '',
      moduleId: '',
      loading: false,
      btnLoading: false,
      listLoading: false,
      dataListLoading: false,
      dataAuthorizeSchemeList: [],
      dataAuthorizeList: [],
      dataSchemeFormVisible: false,
      dataAuthorizeFormVisible: false
    }
  },
  methods: {
    init(moduleId, fullName) {
      this.dataAuthorizeListDrawer = true
      this.moduleId = moduleId
      this.tabActiveName = 'dataAuthorizeScheme'
      this.dialogTitle = `数据权限 - ${fullName}`
      this.$nextTick(() => {
        this.listLoading = true
        this.dataListLoading = true
        this.getAuthorizeSchemeList()
      })
    },
    getAuthorizeSchemeList() {
      // 获取方案管理列表
      getDataAuthorizeSchemeList(this.moduleId).then(res => {
        this.dataAuthorizeSchemeList = res.data.list
        this.listLoading = false
        this.btnLoading = false
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
      })
    },
    getAuthorizeList() {
      // 获取字段列表
      getDataAuthorizeList(this.moduleId).then(res => {
        this.dataAuthorizeList = res.data.list
        this.dataListLoading = false
        this.btnLoading = false
      }).catch(() => {
        this.dataListLoading = false
        this.btnLoading = false
      })
    },
    handleClick(tab, event) {
      this.btnLoading = false
      const activeTab = this.tabActiveName
      if (activeTab === 'dataAuthorizeScheme') {
        this.getAuthorizeSchemeList()
      } else {
        this.getAuthorizeList()
      }
    },
    handleReLoad() {
      this.btnLoading = true
      const activeTab = this.tabActiveName
      if (activeTab === 'dataAuthorizeScheme') {
        this.getAuthorizeSchemeList()
      } else {
        this.getAuthorizeList()
      }
    },
    addOrUpdateHandle(id) {
      const activeTab = this.tabActiveName
      if (activeTab === 'dataAuthorizeScheme') {
        this.dataSchemeFormVisible = true
        this.$nextTick(() => {
          this.$refs.DataSchemeForm.init(this.moduleId, id)
        })
      } else {
        this.dataAuthorizeFormVisible = true
        this.$nextTick(() => {
          this.$refs.DataAuthorizeForm.init(this.moduleId, id)
        })
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        const delMethod = this.tabActiveName === 'dataAuthorizeScheme' ? delDataScheme : delDataAuthorize
        delMethod(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.handleReLoad()
            }
          })
        })
      }).catch(() => { })
    }
  }
}
</script>
<style lang="scss" scoped>
  .HG-flex-main {
    .el-tabs--border-card {
      border: none;
      box-shadow: none;

      :deep(.el-tabs__content) {
        padding: 0 !important;
      }
    }
  }

  .HG-flex-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.el-tabs__content) {
      flex: 1;

      .el-tab-pane {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
