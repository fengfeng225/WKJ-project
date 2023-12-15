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
                <el-col :span="12">
                  <el-form-item label="高压窜低压部位" prop="position">
                    <el-input v-model="dataForm.position" placeholder="请输入高压窜低压部位" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="现状描述" prop="description">
                    <el-input v-model="dataForm.description" type="textarea" resize="none" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入现状描述" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="存在问题及风险分析" prop="riskAnalysis">
                    <el-input v-model="dataForm.riskAnalysis" type="textarea" resize="none" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入存在问题及风险分析" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="现有或临时防窜措施" prop="measures">
                    <el-input v-model="dataForm.measures" type="textarea" resize="none" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入现有或临时防窜措施" />
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
import { getKeyPointBillInfo, updateKeyPointBill, createKeyPointBill } from '@/api/bill/mutualChannelingPoints/keyPoint'
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
        description: '',
        riskAnalysis: '',
        measures: ''
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
          { required: true, message: '请输入高压窜低压部位', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入现状描述', trigger: 'blur' }
        ],
        riskAnalysis: [
          { required: true, message: '请输入存在问题及风险分析', trigger: 'blur' }
        ],
        measures: [
          { required: true, message: '请输入现有或临时防窜措施', trigger: 'blur' }
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
        getKeyPointBillInfo(id).then(res => {
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
        const method = this.dataForm.id ? updateKeyPointBill : createKeyPointBill
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
