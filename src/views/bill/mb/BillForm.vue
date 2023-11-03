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
                <el-col :span="10">
                  <el-form-item label="装置名称" prop="name">
                    <el-input v-model="dataForm.name" placeholder="请输入装置名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="盲板编号" prop="code">
                    <el-input v-model="dataForm.code" placeholder="请输入盲板编号" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="管径" prop="pipDiameter" label-width="60px">
                    <BL-input-number v-model="dataForm.pipDiameter" placeholder="请输入管径" />
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
                  <el-form-item label="负责班组" prop="groupId">
                    <el-select v-model="dataForm.groupId" placeholder="请选择负责班组" style="width: 100%;">
                      <el-option v-for="item in groups" :key="item.id" :label="item.label" :value="item.id" />
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
                    <BL-input-number v-model="dataForm.pipelineMediaPressure" :step="0.1" placeholder="请输入压力" />
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="BL-common-title BL-20">
                <h2 class="bold">盲板信息</h2>
              </div>
              <el-row :gutter="20" class="custom-row">
                <el-col :span="6">
                  <el-form-item label="盲板规格(mm)" prop="size" label-width="120px">
                    <BL-input-number v-model="dataForm.size" placeholder="请输入盲板规格" />
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
                  <el-form-item label="盲通状态" prop="status">
                    <el-switch v-model="dataForm.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" @change="changeStatus" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="拆装时间" prop="disassembleTime">
                    <el-date-picker
                      v-model="dataForm.disassembleTime"
                      value-format="timestamp"
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
                    <el-select v-model="dataForm.operator" placeholder="请选择操作人员">
                      <el-option
                        v-for="item in operatorData"
                        :key="item.entityCode"
                        :label="item.fullName"
                        :value="item.entityCode"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="管理干部" prop="Manager">
                    <el-input v-model="dataForm.Manager" placeholder="请输入管理干部" />
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
import { getShortBillInfo, updateShortBill, createShortBill } from '@/api/bill/mb/bill'
import { getGroupCategories } from '@/api/bill/mb/group'
import { getOptionsByCode } from '@/api/systemData/dictionary'

export default {
  data() {
    return {
      formLoading: false,
      btnLoading: false,
      dataForm: {
        id: '',
        groupId: '',
        name: '',
        code: '',
        status: null,
        pipDiameter: null,
        description: '',
        pipelineMediaName: '',
        pipelineMediaTemperature: '',
        pipelineMediaPressure: null,
        size: null,
        type: '',
        material: '',
        disassembleTime: null,
        operator: '',
        Manager: '',
        enabledMark: 1
      },
      groups: [],
      operatorData: [],
      dataRule: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入盲板编号', trigger: 'blur' }
        ],
        disassembleTime: [
          { required: true, message: '请选择拆装时间', trigger: 'change' }
        ],
        operator: [
          { required: true, message: '请选择操作人员', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    getOptionsByCode('operator').then(res => {
      this.operatorData = res.data.list
    })
    this.getGroupCategories()
  },

  methods: {
    init(id) {
      this.dataForm.id = id || ''
      if (id) {
        this.formLoading = true
        getShortBillInfo(id).then(res => {
          this.dataForm = res.data
          this.formLoading = false
        }).catch(() => {
          this.formLoading = false
        })
      }
    },

    getGroupCategories() {
      getGroupCategories().then(res => {
        this.groups = res.data.list
      }).catch(() => {})
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
        const method = this.dataForm.id ? updateShortBill : createShortBill
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
