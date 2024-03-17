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
              label-width="160px"
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
                <el-col :span="12">
                  <el-form-item label="设备名称" prop="equipmentName">
                    <el-input v-model="dataForm.equipmentName" placeholder="请输入设备名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备位号" prop="equipmentTag">
                    <el-input v-model="dataForm.equipmentTag" placeholder="请输入设备位号" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设计(操作)压力  管/壳" prop="pressure">
                    <el-input v-model="dataForm.pressure" placeholder="设计(操作)压力  管/壳" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设计(操作)温度 管/壳" prop="temperature">
                    <el-input v-model="dataForm.temperature" placeholder="设计(操作)温度 管/壳" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="介质 壳/管" prop="media">
                    <el-input v-model="dataForm.media" placeholder="请输入介质 壳/管" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="规格型号" prop="size">
                    <el-input v-model="dataForm.size" placeholder="请输入规格型号" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="内漏判断" prop="endoleakageJudge">
                    <el-input v-model="dataForm.endoleakageJudge" type="textarea" resize="none" :autosize="{ minRows: 3, maxRows: 3}" placeholder="请输入内漏判断" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="内漏后风险评价" prop="endoleakageRiskAssessment">
                    <el-input v-model="dataForm.endoleakageRiskAssessment" type="textarea" resize="none" :autosize="{ minRows: 3, maxRows: 3}" placeholder="请输入内漏后风险评价" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="内漏后处理" prop="endoleakageDispose">
                    <el-input v-model="dataForm.endoleakageDispose" type="textarea" resize="none" :autosize="{ minRows: 3, maxRows: 3}" placeholder="请输入内漏后处理" />
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
import { getHeatExchangerBillInfo, updateHeatExchangerBill, createHeatExchangerBill } from '@/api/bill/mutualChannelingPoints/heatExchanger'
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
        equipmentName: '',
        equipmentTag: '',
        pressure: '',
        temperature: '',
        media: '',
        size: '',
        endoleakageJudge: '',
        endoleakageRiskAssessment: '',
        endoleakageDispose: ''
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
        equipmentName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        equipmentTag: [
          { required: true, message: '请输入设备位号', trigger: 'blur' }
        ],
        pressure: [
          { required: true, message: '请输入设计(操作)压力  管/壳', trigger: 'blur' }
        ],
        temperature: [
          { required: true, message: '请输入设计(操作)温度 管/壳', trigger: 'blur' }
        ],
        media: [
          { required: true, message: '请输入介质 壳/管', trigger: 'blur' }
        ],
        size: [
          { required: true, message: '请输入规格型号', trigger: 'blur' }
        ],
        endoleakageJudge: [
          { required: true, message: '请输入内漏判断', trigger: 'blur' }
        ],
        endoleakageRiskAssessment: [
          { required: true, message: '请输入内漏后风险评价', trigger: 'blur' }
        ],
        endoleakageDispose: [
          { required: true, message: '请输入内漏后处理', trigger: 'blur' }
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
        getHeatExchangerBillInfo(id).then(res => {
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
        const method = this.dataForm.id ? updateHeatExchangerBill : createHeatExchangerBill
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
