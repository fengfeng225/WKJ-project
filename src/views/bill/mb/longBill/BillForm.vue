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
                <el-col :span="8">
                  <el-form-item label="装置名称" prop="name">
                    <el-select v-model="dataForm.name" placeholder="请输入装置名称" @change="changeDeviceName">
                      <el-option v-for="item in deviceNameList" :key="item.id" :label="item.fullName" :value="item.entityCode" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="盲板编号" prop="code">
                    <el-input v-model="dataForm.code" placeholder="请输入盲板编号" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="管径" prop="pipDiameter" label-width="60px">
                    <el-input v-model="dataForm.pipDiameter" placeholder="请输入管径" />
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item label="盲板安装位置" prop="description">
                    <div class="description-remark">
                      <el-input v-model="dataForm.description" type="textarea" resize="none" :autosize="{ maxRows: 3}" placeholder="请输入盲板安装位置描述" />
                      <span>
                        <i class="el-icon-info" />
                        <em> (注明阀前或阀后)</em>
                      </span>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="负责班组" prop="classId">
                    <el-select v-model="dataForm.classId" placeholder="请选择负责班组" style="width: 100%;">
                      <el-option v-for="item in classes" :key="item.id" :label="item.fullName" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="BL-common-title BL-20">
                <h2 class="bold">管线介质</h2>
              </div>
              <el-row :gutter="20" class="custom-row">
                <el-col :span="10">
                  <el-form-item label="名称" prop="pipelineMediaName">
                    <el-input v-model="dataForm.pipelineMediaName" placeholder="请输入名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="温度 (℃)" prop="pipelineMediaTemperature">
                    <el-input v-model="dataForm.pipelineMediaTemperature" placeholder="请输入温度" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="压力 (MPa)" prop="pipelineMediaPressure">
                    <el-input v-model="dataForm.pipelineMediaPressure" placeholder="请输入压力" />
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="BL-common-title BL-20">
                <h2 class="bold">盲板信息</h2>
              </div>
              <el-row :gutter="20" class="custom-row">
                <el-col :span="6">
                  <el-form-item label="盲板规格(mm)" prop="size" label-width="120px">
                    <el-input v-model="dataForm.size" placeholder="请输入盲板规格" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="盲板形式" prop="type">
                    <el-input v-model="dataForm.type" placeholder="请输入盲板形式" />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="盲板材质" prop="material">
                    <el-input v-model="dataForm.material" placeholder="请输入盲板材质" />
                  </el-form-item>
                </el-col>
                <el-col />
                <el-col :span="6">
                  <el-form-item label="盲通状态" prop="status" required>
                    <el-switch v-model="dataForm.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" @change="changeStatus" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="拆装时间" prop="disassembleTime">
                    <el-date-picker
                      v-model="dataForm.disassembleTime"
                      type="datetime"
                      placeholder="请选择拆装时间"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="BL-common-title BL-20">
                <h2 class="bold">确认人</h2>
              </div>
              <el-row :gutter="20" class="custom-row">
                <el-col :span="12">
                  <el-form-item label="操作人员" prop="operator">
                    <el-input v-model="dataForm.operator" placeholder="请输入操作人员" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="管理干部" prop="manager">
                    <el-select v-model="dataForm.manager" placeholder="请选择管理干部">
                      <el-option v-for="item in managerList" :key="item.id" :label="item.fullName" :value="item.entityCode" />
                    </el-select>
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
import { getLongBillInfo, updateLongBill, createLongBill } from '@/api/bill/mb/bill'
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
        code: '',
        status: null,
        pipDiameter: '',
        description: '',
        pipelineMediaName: '',
        pipelineMediaTemperature: '',
        pipelineMediaPressure: '',
        size: '',
        type: '',
        material: '',
        disassembleTime: null,
        operator: '',
        manager: ''
      },
      classes: [],
      deviceNameList: [],
      managerList: [],
      dataRule: {
        classId: [
          { required: true, message: '请选择班组', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请选择装置名称', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入盲板编号', trigger: 'blur' }
        ],
        pipDiameter: [
          { required: true, message: '请输入管径', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入盲板安装位置描述', trigger: 'blur' }
        ],
        pipelineMediaName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        pipelineMediaTemperature: [
          { required: true, message: '请输入温度', trigger: 'blur' }
        ],
        pipelineMediaPressure: [
          { required: true, message: '请输入压力', trigger: 'blur' }
        ],
        size: [
          { required: true, message: '请输入盲板规格', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入盲板形式', trigger: 'blur' }
        ],
        material: [
          { required: true, message: '请输入盲板材质', trigger: 'blur' }
        ],
        disassembleTime: [
          { required: true, message: '请选择拆装时间', trigger: 'change' }
        ],
        operator: [
          { required: true, message: '请输入操作人员', trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请选择管理干部', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.getDeviceNameList()
    this.getManagerList()
    this.getClassLeaf()
  },

  methods: {
    init(id) {
      this.dataForm.id = id || ''
      if (id) {
        this.formLoading = true
        getLongBillInfo(id).then(res => {
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

    getManagerList() {
      getOptionsByCode('manager').then(res => {
        res.data.list.forEach(item => {
          item.entityCode = item.entityCode.split(',')
        })
        this.managerList = res.data.list
      }).catch(() => {})
    },

    changeDeviceName(name) {
      const manager = this.managerList.find(item => item.entityCode.includes(name))
      if (manager) this.dataForm.manager = manager.fullName
    },

    changeStatus() {
      this.dataForm.disassembleTime = null
      this.dataForm.operator = ''
    },

    goBack() {
      this.$emit('close')
    },

    dataFormSubmit() {
      this.$refs.dataForm.validate().then(() => {
        this.btnLoading = true
        const method = this.dataForm.id ? updateLongBill : createLongBill
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
