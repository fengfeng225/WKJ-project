<template>
  <transition name="el-zoom-in-center">
    <div class="HG-preview-main user-form">
      <div class="HG-common-page-header">
        <el-page-header
          :content="!dataForm.id ?$t(`user.addUser`) : $t(`user.editUser`)"
          @back="goBack"
        />
        <div class="options">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">
            {{ $t('common.confirmButton') }}
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div v-loading="formLoading" class="main" :element-loading-text="$t('common.loadingText')">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px">
          <div class="HG-common-title mb-20">
            <h2 class="bold">{{ $t('permission.basicInformation') }}</h2>
          </div>
          <el-row :gutter="20" class="custom-row">
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.account')" prop="account">
                <el-input v-model="dataForm.account" :placeholder="$t('permission.accountName')" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.name')" prop="realName">
                <el-input v-model="dataForm.realName" :placeholder="$t('permission.realName')" />
              </el-form-item>
            </el-col>
            <!-- <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.gender')" prop="gender">
                <el-select v-model="dataForm.gender" :placeholder="$t('permission.selectGender')">
                  <el-option v-for="item in genderTreeData" :key="item.entityCode"
                             :label="item.fullName" :value="item.entityCode" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.email')" prop="email">
                <el-input v-model="dataForm.email" :placeholder="$t('permission.email')" />
              </el-form-item>
            </el-col> -->
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.affiliation')" prop="organizeId">
                <HG-TreeSelect
                  v-model="dataForm.organizeId"
                  :options="departmentTreeData"
                  :placeholder="$t('permission.selectOrganization')"
                  clearable
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.directSupervisor')" prop="managerId">
                <user-select v-model="dataForm.managerId" :placeholder="$t('permission.selectDirectSupervisor')" />
              </el-form-item>
            </el-col> -->
            <!-- <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.position')" prop="positionId">
                <HG-TreeSelect v-model="dataForm.positionId" :options="positionTreeData" multiple
                                 lastLevel lastLevelKey='type' lastLevelValue='position' :placeholder="$t('permission.selectPosition')"
                                 clearable />
              </el-form-item>
            </el-col> -->
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.role')" prop="roleId">
                <el-select
                  v-model="roleId"
                  multiple
                  :placeholder="$t('permission.selectRole')"
                  filterable
                  @change="roleIdChange"
                >
                  <el-option-group
                    v-for="group in roleTreeData"
                    :key="group.id"
                    :label="group.fullName+(group.num?'【'+group.num+'】':'')"
                  >
                    <el-option
                      v-for="item in group.children"
                      :key="item.id"
                      :label="item.fullName"
                      :value="item.id"
                    />
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('permission.ordering')" prop="sortCode">
                <el-input-number
                  v-model="dataForm.sortCode"
                  :min="0"
                  :max="999999"
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('permission.status')" prop="enabledMark">
                <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('permission.description')" prop="description">
                <el-input v-model="dataForm.description" type="textarea" :rows="6" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <div class="HG-common-title mb-20">
            <h2 class="bold">{{ $t('permission.extendedInformation') }}</h2>
          </div>
          <el-row :gutter="20" class="custom-row">
            <el-col :span="24">
              <el-form-item :label="$t('permission.avatar')" prop="headIcon">
                <el-upload class="avatar-uploader" :action="define.comUploadUrl+'/userAvatar'"
                           :show-file-list="false" :on-success="handleAvatarSuccess" accept="image/*">
                  <img v-if="dataForm.headIcon" :src="define.comUrl+dataForm.headIcon"
                       class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.ethnicGroup')" prop="nation">
                <el-select v-model="dataForm.nation" :placeholder="$t('permission.selectEthnicity')" filterable>
                  <el-option v-for="item in nationTreeData" :key="item.id" :label="item.fullName"
                             :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.origin')" prop="nativePlace">
                <el-input v-model="dataForm.nativePlace" placeholder="$t('permission.origin')" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.entryDate')" prop="entryDate">
                <el-date-picker v-model="dataForm.entryDate" type="date" :placeholder="$t('permission.chooseEntryDate')"
                                value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.documentType')" prop="certificatesType">
                <el-select v-model="dataForm.certificatesType" :placeholder="$t('permission.documentTypeHint')">
                  <el-option v-for="item in certificatesTypeTreeData" :key="item.id"
                             :label="item.fullName" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.idNumber')" prop="certificatesNumber">
                <el-input v-model="dataForm.certificatesNumber" :placeholder="$t('permission.idNumber')" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.education')" prop="education">
                <el-select v-model="dataForm.education" :placeholder="$t('permission.educationHint')">
                  <el-option v-for="item in educationTreeData" :key="item.id" :label="item.fullName"
                             :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.birthday')" prop="birthday">
                <el-date-picker v-model="dataForm.birthday" type="date" :placeholder="$t('permission.birthdayHint')"
                                value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.officePhone')" prop="telePhone">
                <el-input v-model="dataForm.telePhone" :placeholder="$t('permission.officePhone')" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.officeLandline')" prop="landline">
                <el-input v-model="dataForm.landline" :placeholder="$t('permission.officeLandline')" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.mobilePhone')" prop="mobilePhone">
                <el-input v-model="dataForm.mobilePhone" :placeholder="$t('permission.mobilePhone')" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.emergencyContact')" prop="urgentContacts">
                <el-input v-model="dataForm.urgentContacts" :placeholder="$t('permission.emergencyContact')" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item :label="$t('permission.emergencyNumber')" prop="urgentTelePhone">
                <el-input v-model="dataForm.urgentTelePhone" :placeholder="$t('permission.emergencyNumberHint')" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('permission.mailingAddress')" prop="postalAddress">
                <el-input v-model="dataForm.postalAddress" type="textarea" :rows="6" />
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
      </div>
    </div>
  </transition>
</template>
<script>
import { getDepartmentSelector } from '@/api/permission/department'
import { getPositionSelector } from '@/api/permission/position'
import { getRoleSelector } from '@/api/permission/role'
import { createUser, updateUser, getUserInfo } from '@/api/permission/user'
export default {
  data() {
    return {
      visible: false,
      btnLoading: false,
      dataForm: {
        id: '',
        sortCode: 0,
        enabledMark: 1,
        account: '',
        realName: '',
        organizeId: '',
        managerId: '',
        positionId: '',
        roleId: '',
        description: '',
        headIcon: '',
        gender: null,
        nationId: '',
        nativePlace: '',
        entryDate: null,
        certificatesType: '',
        certificatesNumber: '',
        education: '',
        birthday: null,
        telePhone: '',
        landline: '',
        mobilePhone: '',
        email: '',
        urgentContacts: '',
        urgentTelePhone: '',
        postalAddress: ''
      },
      roleId: [],
      departmentTreeData: [],
      positionTreeData: [],
      roleTreeData: [],
      genderTreeData: [],
      nationTreeData: [],
      educationTreeData: [],
      certificatesTypeTreeData: [],
      formLoading: false,
      genderProps: {
        value: 'entityCode',
        label: 'fullName'
      },
      dataRule: {
        account: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          // { validator: this.formValidate('userAccount', '账户名称只能是数字英文'), trigger: 'blur' },
          { max: 50, message: '账户名称最多为50个字符！', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { validator: this.formValidate('fullName', '真实姓名不能含有特殊符号'), trigger: 'blur' },
          { max: 50, message: '真实姓名最多为50个字符！', trigger: 'blur' }
        ]
        //  gender: [
        //    { required: true, message: '请选择性别', trigger: 'change' }
        //  ],
        //  organizeId: [
        //    { required: true, message: '请选择所属组织', trigger: 'change' }
        //  ]
      }
    }
  },
  methods: {
    init(id, organizeId) {
      this.visible = true
      this.dataForm.id = id || ''
      this.roleId = []
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        // 获取公司+部门
        getDepartmentSelector().then(res => {
          this.departmentTreeData = res.data.list
        })
        // 获取岗位
        getPositionSelector().then(res => {
          this.positionTreeData = res.data.list
        })
        // 获取角色
        getRoleSelector().then(res => {
          this.roleTreeData = res.data.list
        })
        // 获取民族
        this.$store.dispatch('base/getDictionaryData', { sort: 'Nation' }).then(res => {
          this.nationTreeData = res
        })
        // 获取学历
        this.$store.dispatch('base/getDictionaryData', { sort: 'Education' }).then(res => {
          this.educationTreeData = res
        })
        // 获取证件类型
        this.$store.dispatch('base/getDictionaryData', { sort: 'certificateType' }).then(res => {
          this.certificatesTypeTreeData = res
        })
        // 获取性别
        this.$store.dispatch('base/getDictionaryData', { sort: 'sex' }).then(res => {
          this.genderTreeData = res
        })
        if (this.dataForm.id) {
          this.formLoading = true
          getUserInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            if (this.dataForm.roleId) this.roleId = this.dataForm.roleId.split(',')
            this.formLoading = false
          }).catch(() => this.formLoading = false)
        } else {
          this.dataForm.organizeId = organizeId
        }
      })
    },
    goBack() {
      this.$emit('close')
    },
    roleIdChange() {
      this.dataForm.roleId = this.roleId.toString()
    },
    handleAvatarSuccess(res) {
      if (res.code === 200 && res.data && res.data.url) {
        this.dataForm.headIcon = res.data.url
      } else {
        this.$message.error('头像上传失败')
      }
    },
    handleConfirm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateUser : createUser
          formMethod(this.dataForm).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
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
<style lang="scss" scoped>
  .user-form {
    .main {
      padding: 10px 30px 0;
    }

    :deep(.el-select),
    :deep(.el-date-editor) {
      width: 100%;
    }

    :deep(.avatar-uploader) {
      .el-upload {
        border: 1px dashed #dcdfe6;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .el-upload:hover {
        border-color: #409eff;
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 130px;
      height: 130px;
      line-height: 130px;
      text-align: center;
    }

    .avatar {
      width: 130px;
      height: 130px;
      display: block;
    }
  }
</style>
