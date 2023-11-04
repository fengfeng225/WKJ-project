<template>
  <el-dialog
    :title="!dataForm.id ? $t(`role.addRole`) : $t(`role.editRole`)"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="HG-dialog HG-dialog_center"
    lock-scroll
    width="600px"
  >
    <el-form
      ref="dataForm"
      v-loading="formLoading"
      :model="dataForm"
      :rules="dataRule"
      label-width="100px"
    >
      <el-form-item :label="$t('permission.roleName')" prop="fullName">
        <el-input v-model="dataForm.fullName" :placeholder="$t('permission.roleNameHint')" maxlength="50" />
      </el-form-item>
      <el-form-item :label="$t('permission.roleCode')" prop="entityCode">
        <el-input v-model="dataForm.entityCode" :placeholder="$t('permission.roleCodeHint')" />
      </el-form-item>
      <el-form-item :label="$t('permission.roleType')" prop="type">
        <el-select v-model="dataForm.type" :placeholder="$t('permission.roleTypeHint')">
          <el-option
            v-for="item in typeOptions"
            :key="item.entityCode"
            :label="item.fullName"
            :value="item.entityCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('permission.ordering')" prop="sortCode">
        <el-input-number
          v-model="dataForm.sortCode"
          :min="0"
          :max="999999"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item :label="$t('permission.status')" prop="enabledMark">
        <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item :label="$t('permission.description')" prop="description">
        <el-input v-model="dataForm.description" type="textarea" :rows="6" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        {{ $t('common.confirmButton') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getRoleInfo,
  createRole,
  updateRole,
  getRoleTypeSelector
} from '@/api/permission/role'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      typeOptions: [],
      dataForm: {
        id: '',
        fullName: '',
        entityCode: '',
        type: '',
        enabledMark: 1,
        sortCode: 0,
        description: ''
      },
      dataRule: {
        fullName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { validator: this.formValidate('fullName', '角色名称不能含有特殊符号'), trigger: 'blur' },
          { max: 50, message: '角色名称最多为50个字符！', trigger: 'blur' }
        ],
        entityCode: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { validator: this.formValidate('entityCode', '角色编码只能输入英文、数字和小数点且小数点不能放在首尾'), trigger: 'blur' },
          { max: 50, message: '角色编码最多为50个字符！', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择角色类型', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || ''
      this.visible = true
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()

        // 角色类型
        getRoleTypeSelector().then(res => {
          this.typeOptions = res.data.list
        })

        if (this.dataForm.id) {
          getRoleInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
          })
        }
      })
      this.formLoading = false
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateRole : createRole
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
