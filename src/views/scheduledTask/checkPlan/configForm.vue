<template>
  <transition name="el-zoom-in-center">
    <div class="BL-preview-main flow-form-main">
      <div class="BL-common-page-header">
        <el-page-header content="修改计划" @back="goBack" />
        <div class="options">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit">
            确定
          </el-button>
          <el-button @click="goBack">取消</el-button>
        </div>
      </div>
      <el-row class="main">
        <el-col :span="14" :offset="5">
          <el-form
            ref="dataForm"
            :model="dataForm"
            :rules="dataRule"
            class="mt-20"
            label-width="100px"
            @submit.native.prevent
          >
            <el-col :span="24">
              <el-form-item label="类目" prop="category">
                <el-input v-model="dataForm.category" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="编码" prop="entityCode">
                <el-input v-model="dataForm.entityCode" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="检查周期" prop="cron">
                <el-input v-model="dataForm.cron" placeholder="Cron表达式" readonly>
                  <el-button slot="append" icon="el-icon-edit-outline" @click="showDialog" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="说明" prop="description">
                <el-input
                  v-model="dataForm.description"
                  placeholder="说明"
                  type="textarea"
                  :rows="3"
                />
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>

      <el-dialog
        title="Cron表达式自动生成"
        :visible.sync="showCron"
        :close-on-click-modal="false"
        lock-scroll
        append-to-body
        width="700px"
        @closed="showCrontab = false"
      >
        <vcrontab
          v-if="showCrontab"
          ref="vcrontab"
          :expression="dataForm.executeContent.cron"
          @hide="showCron=false"
          @fill="crontabFill"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="showCron=false">
            取消
          </el-button>
          <el-button type="warning" @click="resetCrontab">重置</el-button>
          <el-button type="primary" @click="getCrontabValue">
            确定
          </el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
import { TimeTaskInfo, TimeTaskUpdate, TimeTaskCreate } from '@/api/system/timeTask'
import { getDataSourceListAll } from '@/api/systemData/dataSource'
import vcrontab from 'vcrontab'

export default {
  components: { vcrontab },
  data() {
    return {
      showCron: false,
      showCrontab: true,
      dataForm: {
        id: '',
        fullName: '',
        entityCode: '',
        executeType: '1',
        description: '',
        executeContent: {
          cron: '',
          interfaceType: 'GET',
          interfaceUrl: '',
          parameter: [],
          stored: '',
          database: '0',
          storedParameter: []
        }
      },
      dataRule: {
        fullName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        entityCode: [
          { required: true, message: '任务编码不能为空', trigger: 'blur' },
          { validator: this.formValidate('entityCode', '任务编码只能输入英文、数字和小数点且小数点不能放在首尾'), trigger: 'blur' }
        ],
        'executeContent.cron': [
          { required: true, message: 'Cron表达式不能为空', trigger: 'click' }
        ],
        'executeContent.interfaceUrl': [
          { required: true, message: '请求路径不能为空', trigger: 'blur' },
          { type: 'url', message: '请输入正确的请求路径', trigger: 'blur' }
        ],
        'executeContent.stored': [
          { required: true, message: '存储名称不能为空', trigger: 'blur' }
        ]
      },
      formVisible: false,
      btnLoading: false,
      dbOptions: []
    }
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id) {
      this.dataForm = {
        id: '',
        fullName: '',
        entityCode: '',
        executeType: '1',
        description: '',
        executeContent: {
          cron: '',
          interfaceType: 'GET',
          interfaceUrl: '',
          parameter: [],
          stored: '',
          database: '0',
          storedParameter: []
        }
      }
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        getDataSourceListAll().then(res => {
          const defaultItem = {
            fullName: '',
            children: [{
              fullName: '默认数据库',
              id: '0'
            }]
          }
          const list = [defaultItem, ...res.data.list]
          this.dbOptions = list.filter(o => o.children && o.children.length)
          if (this.dataForm.id) {
            TimeTaskInfo(this.dataForm.id).then(res => {
              this.dataForm.description = res.data.description
              this.dataForm.executeContent = JSON.parse(res.data.executeContent)
              this.dataForm.fullName = res.data.fullName
              this.dataForm.executeType = res.data.executeType
              this.dataForm.entityCode = res.data.entityCode
              this.dataForm.sortCode = res.data.sortCode
            })
          } else {
            this.dataForm.entityCode = ''
          }
        })
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const executeContent = JSON.stringify(this.dataForm.executeContent)
          const query = { ...this.dataForm, executeContent }
          const formMethod = this.dataForm.id ? TimeTaskUpdate : TimeTaskCreate
          formMethod(query).then((res) => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => { this.btnLoading = false })
        }
      })
    },
    delParameter(i) {
      this.dataForm.executeContent.parameter.splice(i, 1)
    },
    addParameter() {
      const item = { key: '', value: '' }
      this.dataForm.executeContent.parameter.push(item)
    },
    delStoredParameter(i) {
      this.dataForm.executeContent.storedParameter.splice(i, 1)
    },
    addStoredParameter() {
      const item = { key: '', value: '' }
      this.dataForm.executeContent.storedParameter.push(item)
    },
    getCrontabValue() {
      this.$refs.vcrontab && this.$refs.vcrontab.submitFill()
    },
    resetCrontab() {
      this.$refs.vcrontab && this.$refs.vcrontab.clearCron()
    },
    crontabFill(value) {
      this.dataForm.executeContent.cron = value
    },
    showDialog() {
      this.showCron = true
      this.showCrontab = true
    }
  }
}
</script>
<style lang="scss" scoped>
  :deep(.el-dialog__body) {
    padding: 10px 10px 0 !important;
  }

  :deep(.popup-main) {
    .pop_btn {
      display: none !important;
    }

    .popup-result:nth-child(2) {
      margin-bottom: 2px;
    }
  }

  .delBtn {
    text-align: right;
  }
</style>
