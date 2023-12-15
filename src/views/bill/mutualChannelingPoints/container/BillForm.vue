<template>
  <transition name="el-zoom-in-center">
    <div class="BL-preview-main flow-form-main">
      <div class="BL-common-page-header">
        <el-page-header :content="!dataForm.id ? '新增台账' : '编辑台账'" @back="goBack" />
        <div class="options">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit">保存</el-button>
          <el-button @click="goBack">取消</el-button>
        </div>
      </div>

      <div v-loading="formLoading" class="page-main" element-loading-text="正在加载中">
        <el-row class="main">
          <el-col :span="22" :offset="1">
            <el-form
              ref="dataForm"
              :model="dataForm"
              :rules="dataRule"
              label-width="150px"
            >
              <div class="BL-common-title BL-20">
                <h2 class="bold">基础信息</h2>
              </div>
              <el-row :gutter="20" class="custom-row">
                <el-col :span="12">
                  <el-form-item label="装置名称" prop="name">
                    <el-select v-model="dataForm.name" placeholder="请输入装置名称">
                      <el-option v-for="item in deviceNameList" :key="item.id" :label="item.fullName" :value="item.entityCode" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="负责班组" prop="classId">
                    <el-select v-model="dataForm.classId" placeholder="请选择负责班组">
                      <el-option v-for="item in classes" :key="item.id" :label="item.fullName" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="互窜点位置" prop="position">
                    <el-input v-model="dataForm.position" type="textarea" resize="none" :autosize="{ maxRows: 3}" placeholder="请输入互窜点位置" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设置液位高低报警">
                    <el-checkbox v-model="dataForm.liquidLevelAlarm" :true-label="1" :false-label="0" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="纳入平稳率管理">
                    <el-checkbox v-model="dataForm.smoothnessRate" :true-label="1" :false-label="0" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="互窜后风险" prop="risk">
                    <el-input v-model="dataForm.risk" type="textarea" resize="none" :autosize="{ minRows: 3, maxRows: 3}" placeholder="请输入互窜后风险" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="风险管控措施" prop="riskControlMeasure">
                    <el-input v-model="dataForm.riskControlMeasure" type="textarea" resize="none" :autosize="{ minRows: 3, maxRows: 3}" placeholder="请输入风险管控措施" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="评价结果" prop="evaluation">
                    <el-input v-model="dataForm.evaluation" type="textarea" resize="none" :autosize="{ minRows: 3, maxRows: 3}" placeholder="请输入评价结果" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </transition>
</template>

<script>
import { getContainerBillInfo, updateContainerBill, createContainerBill } from '@/api/bill/mutualChannelingPoints/container'
import { getClassSelector } from '@/api/bill/class'
import { getOptionsByCode } from '@/api/systemData/dictionary'

export default {
  data() {
    return {
      formLoading: false,
      btnLoading: false,
      dataForm: {
        id: '',
        classId: '',
        name: '',
        position: '',
        liquidLevelAlarm: null,
        smoothnessRate: null,
        risk: '',
        riskControlMeasure: '',
        evaluation: ''
      },
      classes: [],
      deviceNameList: [],
      dataRule: {
        classId: [
          { required: true, message: '请选择班组', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请选择装置名称', trigger: 'change' }
        ],
        position: [
          { required: true, message: '请输入互窜点位置', trigger: 'blur' }
        ],
        risk: [
          { required: true, message: '请输入互窜后风险', trigger: 'blur' }
        ],
        riskControlMeasure: [
          { required: true, message: '请输入风险管控措施', trigger: 'blur' }
        ],
        evaluation: [
          { required: true, message: '请输入评价结果', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getDeviceNameList()
    this.getClassSelector()
  },

  methods: {
    init(id) {
      this.dataForm.id = id || ''
      if (id) {
        this.formLoading = true
        getContainerBillInfo(id).then(res => {
          this.dataForm = res.data
          this.formLoading = false
        }).catch(() => {
          this.formLoading = false
        })
      }
    },

    getClassSelector() {
      getClassSelector().then(res => {
        this.classes = res.data.list
      }).catch(() => {})
    },

    getDeviceNameList() {
      getOptionsByCode('deviceName').then(res => {
        this.deviceNameList = res.data.list
      }).catch(() => {})
    },

    goBack() {
      this.$emit('close')
    },

    dataFormSubmit() {
      this.$refs.dataForm.validate().then(() => {
        this.btnLoading = true
        const method = this.dataForm.id ? updateContainerBill : createContainerBill
        method(this.dataForm).then(res => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.btnLoading = false
              this.$emit('close', true)
            }
          })
        }).catch(() => {
          this.btnLoading = false
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.page-main {
  overflow: scroll;
}
</style>
