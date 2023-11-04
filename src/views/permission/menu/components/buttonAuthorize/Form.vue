<template>
  <el-dialog
    :title="!dataForm.id ? $t('system.newButton') : $t('system.editButton')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    lock-scroll
    class="HG-dialog HG-dialog_center"
    width="600px"
  >
    <el-form
      ref="dataForm"
      v-loading="formLoading"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      class="menuForm"
    >
      <el-form-item :label="$t('system.parent')" prop="parentId">
        <HG-TreeSelect v-model="dataForm.parentId" :options="treeData" :placeholder="$t('system.parentHint')" />
      </el-form-item>
      <el-form-item :label="$t('system.name')" prop="fullName">
        <el-input v-model="dataForm.fullName" :placeholder="$t('system.nameHint')" />
      </el-form-item>
      <el-form-item :label="$t('system.code')" prop="entityCode">
        <el-input v-model="dataForm.entityCode" :placeholder="$t('system.codeHint')" />
      </el-form-item>
      <!-- <el-form-item label="图标" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="请选择图标" readonly :suffix-icon="dataForm.icon">
          <el-button slot="append" @click="openIconBox">选择</el-button>
        </el-input>
      </el-form-item> -->
      <el-form-item :label="$t('system.ordering')" prop="sortCode">
        <el-input-number
          v-model="dataForm.sortCode"
          :min="0"
          :max="999999"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item :label="$t('system.status')" prop="enabledMark">
        <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item :label="$t('system.description')" prop="description">
        <el-input v-model="dataForm.description" type="textarea" :rows="6" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        {{ $t('common.confirmButton') }}</el-button>
    </span>
    <icon-box
      ref="iconBox"
      :visible.sync="iconBoxVisible"
      :current="dataForm.icon"
      @choiceIcon="choiceIcon"
    />
  </el-dialog>
</template>

<script>
import {
  getButtonAuthorizeSelector,
  createButton,
  updateButton,
  getButtonInfo
} from '@/api/system/buttonAuthorize'
import iconBox from '@/components/HG-iconBox'

export default {
  components: { iconBox },
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      treeData: [],
      moduleId: '',
      dataForm: {
        id: '',
        parentId: '',
        fullName: '',
        entityCode: '',
        sortCode: 0,
        icon: '',
        enabledMark: 1,
        description: ''
      },
      iconBoxVisible: false,
      dataRule: {
        parentId: [
          { required: true, message: '上级不能为空', trigger: 'input' }
        ],
        fullName: [
          { required: true, message: '按钮名称不能为空', trigger: 'blur' }
        ],
        entityCode: [
          { required: true, message: '按钮编码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(moduleId, id) {
      this.dataForm.id = id || ''
      this.dataForm.moduleId = moduleId
      this.visible = true
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        // 获取上级按钮
        getButtonAuthorizeSelector(this.dataForm.moduleId).then(res => {
          const topItem = {
            fullName: '顶级节点',
            hasChildren: true,
            id: '-1',
            children: res.data.list
          }
          this.treeData = [topItem]
        })

        // 获取按钮数据
        if (this.dataForm.id) {
          getButtonInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
          })
        }
        this.formLoading = false
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateButton : createButton
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
    },
    openIconBox() {
      this.iconBoxVisible = true
    },
    choiceIcon(value) {
      this.dataForm.icon = value
    }
  }
}
</script>
