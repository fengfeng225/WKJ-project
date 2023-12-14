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
              label-width="100px"
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
                    <el-select v-model="dataForm.classId" placeholder="请选择负责班组" style="width: 100%;">
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
                  <el-form-item label="前/后介质" prop="media">
                    <el-input v-model="dataForm.media" placeholder="请输入前/后介质" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="前/后压力(MPa)" prop="pressure">
                    <el-input v-model="dataForm.pressure" placeholder="请输入前/后压力(MPa)" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="隔离方式" prop="isolationWay">
                    <el-input v-model="dataForm.isolationWay" placeholder="请输入隔离方式" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="互窜后风险评价" prop="riskAssessment">
                    <el-input v-model="dataForm.riskAssessment" type="textarea" resize="none" :autosize="{ maxRows: 3}" placeholder="请输入互窜后风险评价" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="防互窜控制措施" prop="controlMeasure">
                    <el-input v-model="dataForm.controlMeasure" type="textarea" resize="none" :autosize="{ maxRows: 3}" placeholder="请输入防互窜控制措施" />
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
import { getUndergroundSludgeOilBillInfo, updateUndergroundSludgeOilBill, createUndergroundSludgeOilBill } from '@/api/bill/mutualChannelingPoints/undergroundSludgeOil'
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
        media: '',
        pressure: '',
        isolationWay: '',
        riskAssessment: '',
        controlMeasure: ''
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
        media: [
          { required: true, message: '请输入前/后介质', trigger: 'blur' }
        ],
        pressure: [
          { required: true, message: '请输入前/后压力(MPa)', trigger: 'blur' }
        ],
        isolationWay: [
          { required: true, message: '请输入隔离方式', trigger: 'blur' }
        ],
        riskAssessment: [
          { required: true, message: '请输入互窜后风险评价', trigger: 'blur' }
        ],
        controlMeasure: [
          { required: true, message: '请输入防互窜控制措施', trigger: 'blur' }
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
        getUndergroundSludgeOilBillInfo(id).then(res => {
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
        const method = this.dataForm.id ? updateUndergroundSludgeOilBill : createUndergroundSludgeOilBill
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
