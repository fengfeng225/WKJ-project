<template>
  <el-dialog
    :title="!dataForm.id ? '新建菜单' : '编辑菜单'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    lock-scroll
    width="600px"
  >
    <el-form
      ref="dataForm"
      v-loading="formLoading"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
    >
      <el-form-item label="上级" prop="parentId">
        <BL-TreeSelect
          v-model="dataForm.parentId"
          :options="treeData"
          placeholder="选择上级菜单"
        />
      </el-form-item>
      <el-form-item label="名称" prop="fullName">
        <el-input v-model="dataForm.fullName" placeholder="输入名称" />
      </el-form-item>
      <el-form-item label="编码" prop="entityCode">
        <el-input v-model="dataForm.entityCode" placeholder="输入编码" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input
          v-model="dataForm.icon"
          placeholder="请输入图标编码"
          readonly
          :suffix-icon="dataForm.icon"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="dataForm.type" placeholder="请选择类型" @change="changeMenuType">
          <el-option
            v-for="item in typeData"
            :key="item.entityCode"
            :label="item.fullName"
            :value="item.entityCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.type == 2" label="地址" prop="urlAddress">
        <el-input v-model="dataForm.urlAddress" placeholder="填写地址">
          <template
            v-if="dataForm.type == 2"
            slot="prepend"
          >
            @/views/
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sortCode">
        <el-input-number
          v-model="dataForm.sortCode"
          :min="0"
          :max="999999"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="状态" prop="enabledMark">
        <el-switch v-model="dataForm.enabledMark" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="说明" prop="bodyText">
        <el-input v-model="dataForm.description" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit">
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getMenuSelector, createMenu, updateMenu, getMenuInfo } from '@/api/system/menu'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      treeData: [],
      typeData: [
        {
          entityCode: 1,
          fullName: '目录'
        }, {
          entityCode: 2,
          fullName: '页面'
        }
      ],
      dictionaryData: [],
      dataForm: {
        id: '',
        parentId: '',
        fullName: '',
        entityCode: '',
        sortCode: 0,
        icon: '',
        type: null,
        urlAddress: '',
        linkTarget: '_self',
        isButtonAuthorize: 0,
        isColumnAuthorize: 0,
        enabledMark: 1,
        description: '',
        propertyJson: {
          moduleId: '',
          isTree: 0
        }
      },
      dataRule: {
        parentId: [
          { required: true, message: '上级菜单不能为空', trigger: 'input' }
        ],
        fullName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' },
          { max: 50, message: '菜单名称最多为50个字符！', trigger: 'blur' }
        ],
        entityCode: [
          { required: true, message: '菜单编码不能为空', trigger: 'blur' },
          { max: 50, message: '菜单编码最多为50个字符！', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '菜单图标不能为空', trigger: 'click' }
        ],
        type: [
          { required: true, message: '请选择菜单类型', trigger: 'change' }
        ],
        category: [
          { required: true, message: '请选择菜单分类', trigger: 'input' }
        ],
        urlAddress: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      Object.assign(this.$data, this.$options.data())
      this.dataForm.id = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        // 获取上级菜单
        getMenuSelector(id || 0).then(res => {
          const topItem = {
            fullName: '顶级节点',
            hasChildren: true,
            id: '-1',
            children: res.data.list
          }
          this.treeData = [topItem]
        })

        // 获取表单数据
        if (this.dataForm.id) {
          this.formLoading = true
          getMenuInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            const propertyJson = res.data.propertyJson ? JSON.parse(res.data.propertyJson) : null
            this.dataForm.propertyJson = propertyJson || { moduleId: '' }
            const menuType = this.dataForm.type
            if (menuType === 2) {
              this.dataForm.isButtonAuthorize = 1
              this.dataForm.isColumnAuthorize = 1
            }
            this.$nextTick(() => {
              this.formLoading = false
            })
          }).catch(() => {
            this.formLoading = false
          })
        }
      })
    },

    // 切换类型
    changeMenuType(val) {
      // 重置关联下拉框的值及链接处理
      this.dataForm.propertyJson.moduleId = ''
      const menuId = this.dataForm.id
      if (menuId) this.dataForm.urlAddress = ''
      if (val === 2) {
        this.dataForm.isButtonAuthorize = 1
        this.dataForm.isColumnAuthorize = 1
      } else {
        this.dataForm.isButtonAuthorize = 0
        this.dataForm.isColumnAuthorize = 0
      }
    },

    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateMenu : createMenu
          const query = {
            ...this.dataForm,
            propertyJson: JSON.stringify(this.dataForm.propertyJson)
          }
          formMethod(query).then(res => {
            this.$message({
              message: res.message,
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
