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
              label-width="180px"
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
                  <el-form-item label="放空阀封堵位置" prop="position">
                    <el-input v-model="dataForm.position" type="textarea" resize="none" :autosize="{ maxRows: 3}" placeholder="请输入放空阀封堵位置" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="介质" prop="media">
                    <el-input v-model="dataForm.media" placeholder="请输入介质" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="介质最高操作温度 (℃)" prop="temperature">
                    <el-input v-model="dataForm.temperature" placeholder="请输入介质最高操作温度 (℃)" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="介质最高操作压力 (MPa)" prop="pressure">
                    <el-input v-model="dataForm.pressure" placeholder="请输入介质最高操作压力 (MPa)" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="放空阀封堵直径 (DN)" prop="diameter">
                    <el-input v-model="dataForm.diameter" placeholder="请输入放空阀封堵直径 (DN)" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="放空阀封堵类型" prop="type">
                    <el-input v-model="dataForm.type" placeholder="请输入放空阀封堵类型" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="封堵形式" prop="plugging">
                    <el-input v-model="dataForm.plugging" placeholder="请输入封堵形式" />
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
import { getPipeCapBillInfo, updatePipeCapBill, createPipeCapBill } from '@/api/bill/pipeCap'
import { getClassLeaf } from '@/api/bill/class'
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
        temperature: '',
        pressure: '',
        diameter: '',
        type: '',
        plugging: ''
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
          { required: true, message: '请输入放空阀封堵位置', trigger: 'blur' }
        ],
        media: [
          { required: true, message: '请输入介质', trigger: 'blur' }
        ],
        temperature: [
          { required: true, message: '请输入介质最高操作温度 (℃)', trigger: 'blur' }
        ],
        pressure: [
          { required: true, message: '请输入介质最高操作压力 (MPa)', trigger: 'blur' }
        ],
        diameter: [
          { required: true, message: '请输入放空阀封堵直径 (DN)', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入放空阀封堵类型', trigger: 'blur' }
        ],
        plugging: [
          { required: true, message: '请输入封堵形式', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getDeviceNameList()
    this.getClassLeaf()
  },

  methods: {
    init(id) {
      this.dataForm.id = id || ''
      if (id) {
        this.formLoading = true
        getPipeCapBillInfo(id).then(res => {
          this.dataForm = res.data
          this.formLoading = false
        }).catch(() => {
          this.formLoading = false
        })
      }
    },

    getClassLeaf() {
      getClassLeaf().then(res => {
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
        const method = this.dataForm.id ? updatePipeCapBill : createPipeCapBill
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

.description-remark {
  display: flex;
  align-items: center;
  span {
    width: 180px;
    margin-left: 8px;
    font-size: 12px;
    color: #919191;
  }
}
</style>
