<template>
  <div>
    <el-drawer
      ref="drawer"
      :title="dialogTitle"
      :visible.sync="buttonAuthorizeListDrawer"
      :wrapper-closable="false"
      size="700px"
      class="BL-common-drawer"
    >
      <div class="BL-flex-main">
        <div class="BL-common-head">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
          </div>
          <div class="BL-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link
                icon="el-icon-refresh"
                :underline="false"
                @click="getList()"
              />
            </el-tooltip>
          </div>
        </div>
        <BL-table
          v-loading="listLoading"
          :data="btnList"
          row-key="id"
        >
          <el-table-column prop="fullName" label="按钮名称" width="160" />
          <el-table-column prop="entityCode" label="按钮编码" />
          <el-table-column prop="sortCode" label="排序" width="90" align="center" />
          <el-table-column label="状态" width="90">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{ scope.row.enabledMark == 1 ? '正常' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
              <el-button type="text" class="BL-table-delBtn" @click="handleDel(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </BL-table>
      </div>
    </el-drawer>
    <ButtonAuthorizeForm
      v-if="buttonAuthorizeFormVisible"
      ref="ButtonAuthorizeForm"
      @refreshDataList="getList"
    />
  </div>
</template>

<script>
import {
  getButtonAuthorizeList,
  delButton
} from '@/api/system/buttonAuthorize'
import ButtonAuthorizeForm from './Form'

export default {
  components: {
    ButtonAuthorizeForm
  },
  inheritAttrs: false,
  data() {
    return {
      buttonAuthorizeListDrawer: false,
      buttonAuthorizeFormVisible: false,
      dialogTitle: '',
      moduleId: '',
      loading: false,
      listLoading: false,
      btnList: []
    }
  },

  methods: {
    init(moduleId, fullName) {
      this.buttonAuthorizeListDrawer = true
      this.moduleId = moduleId
      this.dialogTitle = `按钮权限 - ${fullName}`
      this.getList()
    },
    getList() {
      this.listLoading = true
      getButtonAuthorizeList(this.moduleId).then(res => {
        this.btnList = res.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    addOrUpdateHandle(id) {
      this.buttonAuthorizeFormVisible = true
      this.$nextTick(() => {
        this.$refs.ButtonAuthorizeForm.init(this.moduleId, id)
      })
    },

    handleDel(id) {
      this.$confirm('您确定要删除该条数据吗?', '提示', {
        type: 'warning'
      }).then(() => {
        delButton(id).then(res => {
          this.$message({
            type: 'success',
            message: res.message,
            duration: 1500,
            onClose: () => {
              this.getList()
            }
          })
        })
      }).catch(() => { })
    }
  }
}
</script>
