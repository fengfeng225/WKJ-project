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
      <el-row v-loading="loading" class="main">
        <el-col :span="14" :offset="5">
          <el-form
            ref="dataForm"
            :model="dataForm"
            :rules="dataRule"
            label-width="120px"
            @submit.native.prevent
          >
            <el-col :span="24">
              <el-form-item label="台账类别" prop="fullName">
                <el-input v-model="dataForm.fullName" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="编码" prop="entityCode">
                <el-input v-model="dataForm.entityCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="检查周期" prop="cron">
                <el-input v-model="dataForm.cron" placeholder="Cron表达式" readonly>
                  <el-button slot="append" icon="el-icon-edit-outline" @click="showCronDialog('cron')" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="stopCron">
                <template #label>
                  <span>截止日期</span>
                  <el-tooltip content="若只修改截止日期，则立刻生效；若同时修改检查周期和截止日期，则次轮生效。" placement="top-start">
                    <i class="el-icon-info stop-cron-remark" />
                  </el-tooltip>
                </template>
                <el-input v-model="dataForm.stopCron" placeholder="Cron表达式" readonly>
                  <el-button slot="append" icon="el-icon-edit-outline" @click="showCronDialog('stopCron')" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="排序" prop="sortCode">
                <el-input-number
                  v-model="dataForm.sortCode"
                  :min="0"
                  :max="999999"
                  controls-position="right"
                />
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
        title="生成Cron表达式"
        :visible.sync="showCron"
        :close-on-click-modal="false"
        lock-scroll
        append-to-body
        width="700px"
        @closed="showCronTab = false"
      >
        <vcrontab v-if="showCronTab" :expression="dataForm[currentCron]" @hide="showCron = false" @fill="crontabFill" />
      </el-dialog>
    </div>
  </transition>
</template>

<script>
import { getCheckPlanInfo, updateCheckPlan } from '@/api/scheduledTask/billCheckPlan'
import vcrontab from '@/components/vcrontab'

export default {
  components: {
    vcrontab
  },
  data() {
    return {
      loading: false,
      btnLoading: false,
      showCron: false,
      showCronTab: false,
      currentCron: '',
      dataForm: {
        id: '',
        fullName: '',
        entityCode: '',
        cron: '',
        stopCron: '',
        description: '',
        sortCode: 0
      },
      dataRule: {
        fullName: [
          { required: true, message: '台账类别不能为空', trigger: 'blur' }
        ],
        entityCode: [
          { required: true, message: '编码不能为空', trigger: 'blur' }
        ],
        cron: [
          { required: true, message: 'Cron表达式不能为空', trigger: 'click' }
        ],
        stopCron: [
          { required: true, message: 'Cron表达式不能为空', trigger: 'click' }
        ]
      }
    }
  },

  methods: {
    init(id) {
      this.loading = true
      getCheckPlanInfo(id).then(res => {
        this.dataForm = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          updateCheckPlan(this.dataForm).then((res) => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => { this.btnLoading = false })
        }
      })
    },

    goBack() {
      this.$emit('close')
    },

    showCronDialog(cronName) {
      this.currentCron = cronName
      this.showCron = true
      this.showCronTab = true
    },

    crontabFill(value) {
      this.dataForm[this.currentCron] = value
    }

  }
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 10px 10px 0 !important;
}
.stop-cron-remark {
  padding-left: 5px;
  color: #9d9e9e;
}
</style>
