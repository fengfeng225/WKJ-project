<template>
  <el-drawer
    title="检查记录"
    :visible.sync="drawer"
    :close-on-press-escape="false"
    :wrapper-closable="false"
    size="420px"
    @closed="close"
  >
    <div class="records-drawer">
      <div class="search-box">
        <div>
          <label class="record-type-label">台账类别</label>
          <el-select v-model="type">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <el-button type="primary" icon="el-icon-search" :disabled="!type" @click="search">查询</el-button>
      </div>
      <el-divider />
      <el-timeline v-loading="loading">
        <el-timeline-item
          v-for="item in recordList"
          :key="item.id"
          size="large"
          :icon="getCheckRecordIcon(item.checkStatus)"
          :type="getCheckRecordType(item.checkStatus)"
          :timestamp="item.creatorTime"
          placement="top"
        >
          <el-card>
            <div class="basic">
              <h4 style="font-size: 16px;">{{ item.fullName }}</h4>
              <div class="user-info">
                <table>
                  <tr>
                    <td align="right">检查人员：</td>
                    <td><span style="margin-left:8px;">{{ item.inspector }}</span></td>
                  </tr>
                  <tr>
                    <td align="right">检查时间：</td>
                    <td><span style="margin-left:8px;">{{ item.checkedTime }}</span></td>
                  </tr>
                  <tr>
                    <td align="right">台账类别：</td>
                    <td><span style="margin-left:8px;">{{ item.type }}</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <div v-if="item.checkStatus === -1">
              <el-button size="mini" type="primary" @click="showDialog(item.id)">点击处理</el-button>
            </div>
            <div v-if="item.checkStatus === 2" class="remark">处理说明：{{ item.description }}</div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <el-dialog
      title="异常处理"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      :visible.sync="visible"
      @close="closeDialog"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="50px"
      >
        <el-form-item label="说明" prop="description" :rules="{ required: true, message: '请输入处理说明', trigger: 'blur' }">
          <el-input v-model="dataForm.description" type="textarea" placeholder="请输入处理说明" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit">确定</el-button>
      </span>
    </el-dialog>
  </el-drawer>
</template>

<script>
import { getCheckRecords, fixRecord } from '@/api/bill/class'

export default {
  data() {
    return {
      drawer: false,
      visible: false,
      loading: false,
      btnLoading: false,
      classId: '',
      type: '',
      typeList: [],
      recordList: [],
      handled: false,
      dataForm: {
        id: '',
        description: ''
      }
    }
  },

  methods: {
    init(id, typeList) {
      this.classId = id
      this.typeList = typeList
      this.type = typeList[0]?.value || ''
      this.drawer = true
    },

    search() {
      this.loading = true
      getCheckRecords(this.classId, this.type).then(res => {
        this.recordList = res.data.list
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    close() {
      this.$emit('close', this.handled)
    },

    showDialog(id) {
      this.dataForm.id = id
      this.visible = true
    },

    closeDialog() {
      this.$refs.dataForm.resetFields()
    },

    dataFormSubmit() {
      this.$refs.dataForm.validate().then(() => {
        this.btnLoading = true
        fixRecord(this.dataForm).then(res => {
          this.handled = true
          this.$message({
            message: res.message,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.btnLoading = false
              this.search()
            }
          })
        }).catch(() => {
          this.btnLoading = false
        })
      }).catch(() => {})
    },

    getCheckRecordIcon(status) {
      switch (status) {
        case 1:
          return 'el-icon-check'
        case -1:
          return 'el-icon-close'
        case 2:
          return 'el-icon-info'
        default:
          return 'el-icon-question'
      }
    },

    getCheckRecordType(status) {
      switch (status) {
        case 1:
          return 'success'
        case -1:
          return 'danger'
        case 2:
          return 'warning'
        default:
          return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.records-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  padding-top: 0;
  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .record-type-label {
      line-height: 32px;
      font-size: 14px;
      font-weight: 400;
      color: #606266;
      width: 80px;
      margin-right: 10px;
    }
  }
  .el-timeline {
    flex: 1;
    .basic {
      width: 50%;
      .user-info {
        padding-top: 10px;
        table {
          color: #909399;
          font-size: 12px;
          td {
            word-break: break-all;
          }
        }
      }
    }
    .remark {
      width: 40%;
      word-break: break-all;
    }
  }
}
::v-deep .el-card__body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}
</style>
