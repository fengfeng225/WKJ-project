<template>
  <el-dialog
    :title="!dataForm.id ? $t('system.createField') : $t('system.editField')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    lock-scroll
    class="HG-dialog HG-dialog_center"
    width="630px"
  >
    <el-form
      ref="dataForm"
      v-loading="formLoading"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      class="menuForm"
    >
      <el-form-item :label="$t('system.fieldName')" prop="entityCode">
        <el-input v-model="dataForm.entityCode" :placeholder="$t('system.fieldNameHint')" />
      </el-form-item>
      <el-form-item :label="$t('system.fieldDescription')" prop="fullName">
        <el-input v-model="dataForm.fullName" :placeholder="$t('system.fieldDescriptionHint')" />
      </el-form-item>
      <el-form-item :label="$t('system.fieldType')" prop="type">
        <el-select v-model="dataForm.type" :placeholder="$t('system.fieldType')" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('system.conditionalSymbol')" prop="conditionSymbol">
        <el-select v-model="conditionSymbol" multiple :placeholder="$t('system.conditionalSymbolHint')">
          <el-option
            v-for="item in computedConditionSymbolOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('system.conditionalContent')" prop="conditionText">
        <el-select v-model="dataForm.conditionText" :placeholder="$t('system.conditionalContentHint')" clearable>
          <el-option
            v-for="item in computedConditionTextOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('system.description')" prop="description">
        <el-input v-model="dataForm.description" type="textarea" :rows="6" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        {{ $t('common.confirmButton') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  createDataAuthorize,
  updateDataAuthorize,
  getDataAuthorizeInfo
} from '@/api/system/dataAuthorize'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      typeOptions: [{
        value: 'String',
        label: 'String'
      }, {
        value: 'Int32',
        label: 'Int32'
      }, {
        value: 'Double',
        label: 'Double'
      }],

      conditionTextOptions: [],

      conditionSymbolOptions: [],

      dataForm: {
        id: '',
        moduleId: '',
        fullName: '',
        entityCode: '',
        type: '',
        conditionSymbol: '',
        conditionText: '',
        description: ''
      },
      conditionSymbol: [],
      dataRule: {
        entityCode: [
          { required: true, message: '字段名称不能为空', trigger: 'blur' }
        ],
        fullName: [
          { required: true, message: '字段说明不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择字段类型', trigger: 'blur' }
        ],
        conditionSymbol: [
          { required: true, message: '请选择条件符号', trigger: 'blur' }
        ],
        conditionText: [
          { required: true, message: '请选择条件内容', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    computedConditionTextOptions() {
      return this.conditionTextOptions
    },

    computedConditionSymbolOptions() {
      return this.conditionSymbolOptions
    }
  },

  mounted() {
    this.conditionTextOptions = [{
      value: 'text',
      label: this.$t('system.conditionTextOptionsArbitrary')
    }, {
      value: '@organizeId',
      label: this.$t('system.conditionTextOptionsCurrentOrganization')
    }, {
      value: '@organizationAndSuborganization',
      label: this.$t('system.conditionTextOptionsCurrentOrganizationAndSub')
    }, {
      value: '@userId',
      label: this.$t('system.conditionTextOptionsCurrentUser')
    }, {
      value: '@userAraSubordinates',
      label: this.$t('system.conditionTextOptionsCurrentUserAndSub')
    }]

    this.conditionSymbolOptions = [{
      value: 'Equal',
      label: this.$t('system.conditionSymbolOptionsEqual')
    }, {
      value: 'NotEqual',
      label: this.$t('system.conditionSymbolOptionsNotEqual')
    }, {
      value: 'GreaterThan',
      label: this.$t('system.conditionSymbolOptionsGreaterThan')
    }, {
      value: 'GreaterThanOrEqual',
      label: this.$t('system.conditionSymbolOptionsGreaterThanOrEqual')
    }, {
      value: 'LessThan',
      label: this.$t('system.conditionSymbolOptionsLessThan')
    }, {
      value: 'LessThanOrEqual',
      label: this.$t('system.conditionSymbolOptionsLessThanOrEqual')
    }]
  },

  methods: {
    init(moduleId, id) {
      this.dataForm.id = id || ''
      this.dataForm.moduleId = moduleId
      this.conditionSymbol = []
      this.visible = true
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        // 获取字段数据
        if (this.dataForm.id) {
          getDataAuthorizeInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.conditionSymbol = res.data.conditionSymbol ? res.data.conditionSymbol.split(',') : []
          })
        }
        this.formLoading = false
      })
    },
    dataFormSubmit() {
      this.dataForm.conditionSymbol = this.conditionSymbol.join()
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateDataAuthorize : createDataAuthorize
          formMethod(this.dataForm).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>
