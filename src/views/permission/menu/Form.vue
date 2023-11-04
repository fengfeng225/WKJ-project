<template>
  <el-dialog
    :title="!dataForm.id ? $t('system.newMenu') : $t('system.editMenu')"
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
      :element-loading-text="$t('common.loadingText')"
      class="menuForm"
    >
      <el-form-item :label="$t('system.category')" prop="category">
        <el-input v-model="dataForm.category" disabled />
      </el-form-item>
      <el-form-item :label="$t('system.parent')" prop="parentId">
        <HG-TreeSelect
          v-model="dataForm.parentId"
          :options="treeData"
          :placeholder="$t('system.parentHint')"
          @change="onChange"
        />
      </el-form-item>
      <el-form-item :label="$t('system.name')" prop="fullName">
        <el-input v-model="dataForm.fullName" :placeholder="$t('system.nameHint')" />
      </el-form-item>
      <el-form-item :label="$t('system.code')" prop="entityCode">
        <el-input v-model="dataForm.entityCode" :placeholder="$t('system.codeHint')" />
      </el-form-item>
      <el-form-item :label="$t('system.icon')" prop="icon">
        <el-row type="flex">
          <div style="flex:1;margin-right:10px">
            <el-input
              v-model="dataForm.icon"
              :placeholder="$t('system.iconHint')"
              readonly
              :suffix-icon="dataForm.icon"
            >
              <el-button slot="append" @click="openIconBox">{{ $t('common.chooseButton') }}</el-button>
            </el-input>
          </div>
          <el-color-picker
            v-model="dataForm.propertyJson.iconBackgroundColor"
            :predefine="['#188ae2', '#35b8e0', '#26bf8c','#f9c851','#ff5b5b', '#5b69bc', '#ff8acc', '#3b3e47','#282828' ]"
          />
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('system.type')" prop="type">
        <el-select v-model="dataForm.type" :placeholder="$t('system.typeHint')" @change="changeMenuType">
          <el-option
            v-for="item in typeData"
            :key="item.entityCode"
            :label="item.fullName"
            :value="item.entityCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.type == 2 || dataForm.type == 7" :label="$t('system.address')" prop="urlAddress">
        <el-input v-model="dataForm.urlAddress" :placeholder="$t('system.addressHint')">
          <template
            v-if="dataForm.category ==='Web' && dataForm.type == 2"
            slot="prepend"
          >
            @/views/
          </template>
          <el-select
            v-if="dataForm.category ==='Web' && dataForm.type == 7"
            slot="append"
            v-model="dataForm.linkTarget"
            style="width: 90px;"
          >
            <el-option label="_self" value="_self" />
            <el-option label="_blank" value="_blank" />
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="[3,4,5,6,8].indexOf(dataForm.type)>-1"
        :label="$t('system.relation')"
        prop="propertyJson.moduleId"
      >
        <HG-TreeSelect
          v-model="dataForm.propertyJson.moduleId"
          :options="tempData"
          :placeholder="$t('system.relationHint')"
          last-level
          filterable
          @change="handleSelectModule"
        />
      </el-form-item>
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
      <el-form-item :label="$t('system.description')" prop="bodyText">
        <el-input v-model="dataForm.description" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        {{ $t('common.confirmButton') }}
      </el-button>
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
import { getMenuSelector, createMenu, updateMenu, getMenuInfo } from '@/api/system/menu'
import { getFeatureSelector } from '@/api/onlineDev/visualDev'
import { getDictionaryType } from '@/api/systemData/dictionary'
import { getDataReportSelector } from '@/api/onlineDev/dataReport'
import { getDataVSelector } from '@/api/onlineDev/dataV'
import { getPortalSelector } from '@/api/onlineDev/portal'
import iconBox from '@/components/HG-iconBox'
import i18n from '@/lang'

const appTypeData = [{
  entityCode: 1,
  fullName: i18n.t('system.typeList')
}, {
  entityCode: 2,
  fullName: i18n.t('system.typePage')
}, {
  entityCode: 3,
  fullName: i18n.t('system.typeFunction')
}, {
  entityCode: 7,
  fullName: i18n.t('system.typeBacklink')
}]
const typeData = [
  {
    entityCode: 1,
    fullName: i18n.t('system.typeList')
  }, {
    entityCode: 2,
    fullName: i18n.t('system.typePage')
  }, {
    entityCode: 3,
    fullName: i18n.t('system.typeFunction')
  }, {
    entityCode: 4,
    fullName: i18n.t('system.typeDictionary')
  }, {
    entityCode: 5,
    fullName: i18n.t('system.typeReport')
  }, {
    entityCode: 6,
    fullName: i18n.t('system.typeLargeScreen')
  }, {
    entityCode: 8,
    fullName: i18n.t('system.typePortal')
  }, {
    entityCode: 7,
    fullName: i18n.t('system.typeBacklink')
  }]

export default {
  components: { iconBox },
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      treeData: [],
      typeData: [],
      featureWebData: [],
      featureAppData: [],
      dictionaryData: [],
      reportData: [],
      screenData: [],
      portalData: [],
      tempData: [],
      labelName: '',
      related: false,
      oldUrlAddress: '',
      dataForm: {
        id: '',
        parentId: '',
        fullName: '',
        entityCode: '',
        sortCode: 0,
        icon: '',
        type: null,
        urlAddress: '',
        category: 'Web',
        linkTarget: '_self',
        isButtonAuthorize: 0,
        isColumnAuthorize: 0,
        isFormAuthorize: 0,
        isDataAuthorize: 0,
        enabledMark: 1,
        description: '',
        propertyJson: {
          moduleId: '',
          iconBackgroundColor: '',
          isTree: 0
        }
      },
      iconBoxVisible: false,
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
        ],
        'propertyJson.moduleId': [
          { required: true, message: '关联不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id, category) {
      Object.assign(this.$data, this.$options.data())
      this.dataForm.id = id || ''
      this.related = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.category = category
        // 获取上级菜单
        getMenuSelector({ category }, id || 0).then(res => {
          const topItem = {
            fullName: '顶级节点',
            hasChildren: true,
            id: '-1',
            children: res.data.list
          }
          this.treeData = [topItem]
        })
        // 获取菜单类型
        this.typeData = this.dataForm.category === 'App' ? appTypeData : typeData
        // 获取表单数据
        if (this.dataForm.id) {
          this.formLoading = true
          getMenuInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            const propertyJson = res.data.propertyJson ? JSON.parse(res.data.propertyJson) : null
            this.dataForm.propertyJson = propertyJson || { moduleId: '', iconBackgroundColor: '' }
            const menuType = this.dataForm.type
            if ([2, 3, 4].includes(menuType)) {
              this.dataForm.isButtonAuthorize = 1
              this.dataForm.isColumnAuthorize = 1
              this.dataForm.isFormAuthorize = 1
              this.dataForm.isDataAuthorize = 1
            }
            this.oldUrlAddress = res.data.urlAddress
            this.switchType(menuType)
            this.$nextTick(() => { this.formLoading = false })
          }).catch(() => { })
        }
      })
    },
    // 功能列表
    fetchFeatureList() {
      if (!this.featureWebData.length) {
        getFeatureSelector({ type: this.dataForm.category === 'Web' ? 1 : 2 }).then(res => {
          this.featureWebData = res.data.list
          this.tempData = this.featureWebData
        })
        return
      }
      this.tempData = this.featureWebData
    },
    // 字典类型
    fetchDictionaryType() {
      if (!this.dictionaryData.length) {
        getDictionaryType().then(res => {
          this.dictionaryData = res.data.list
          this.tempData = this.dictionaryData
        })
        return
      }
      this.tempData = this.dictionaryData
    },
    // 报表列表
    fetchDataReportList() {
      if (!this.reportData.length) {
        this.$store.dispatch('base/getDictionaryData', { sort: 'ReportSort' }).then(t => {
          const ReportSortTypeList = JSON.parse(JSON.stringify(t))
          getDataReportSelector().then(res => {
            const reportData = res.data.list
            this.reportData = ReportSortTypeList
            this.$nextTick(() => {
              for (let i = 0; i < this.reportData.length; i++) {
                const child = reportData.filter(o => this.reportData[i].id === o.categoryId)
                this.$set(this.reportData[i], 'children', child)
              }
              this.reportData = this.reportData.filter(o => o.children.length)
              this.tempData = this.reportData
            })
          })
        })
        return
      }
      this.tempData = this.reportData
    },
    // 大屏列表
    fetchDataVList() {
      if (!this.screenData.length) {
        getDataVSelector().then(res => {
          this.screenData = res.data.list
          this.tempData = this.screenData
        })
        return
      }
      this.tempData = this.screenData
    },
    // 门户列表
    fetchPortalList() {
      if (!this.portalData.length) {
        getPortalSelector().then(res => {
          this.portalData = res.data.list
          this.tempData = this.portalData
        })
        return
      }
      this.tempData = this.portalData
    },
    switchType(val) {
      switch (val) {
        case 3:
          this.fetchFeatureList()
          break
        case 4:
          this.fetchDictionaryType()
          break
        case 5:
          this.fetchDataReportList()
          break
        case 6:
          this.fetchDataVList()
          break
        case 8:
          this.fetchPortalList()
          break
      }
    },
    onChange(val) {
      if (this.dataForm.category !== 'App') return
      if (val === '-1') {
        this.typeData = appTypeData.filter(o => o.entityCode == 1)
        if (this.dataForm.type != 1) this.dataForm.type = ''
      } else {
        this.typeData = appTypeData.filter(o => o.entityCode != 1)
        if (this.dataForm.type == 1) this.dataForm.type = ''
      }
    },
    // 切换类型
    changeMenuType(val) {
      // 重置关联下拉框的值及链接处理
      this.dataForm.propertyJson.moduleId = ''
      const menuId = this.dataForm.id
      if (menuId) this.dataForm.urlAddress = ''
      if ([2, 3, 4].includes(val)) {
        this.dataForm.isButtonAuthorize = 1
        this.dataForm.isColumnAuthorize = 1
        this.dataForm.isFormAuthorize = 1
        this.dataForm.isDataAuthorize = 1
      } else {
        this.dataForm.isButtonAuthorize = 0
        this.dataForm.isColumnAuthorize = 0
        this.dataForm.isFormAuthorize = 0
        this.dataForm.isDataAuthorize = 0
      }
      if (val == 6) {
        this.dataForm.linkTarget = '_blank'
      } else {
        this.dataForm.linkTarget = '_self'
      }
      this.switchType(this.dataForm.type)
    },
    // 树转数组
    treeToArray(list, newArr = []) {
      list.forEach((item) => {
        const { children } = item
        if (children) {
          // delete item.children
          if (children.length) {
            newArr.push(item)
            return this.treeToArray(children, newArr)
          }
        }
        newArr.push(item)
      })
      return newArr
    },
    handleSelectModule(val) {
      if (this.dataForm.type == 4) {
        const item = this.treeToArray(this.dictionaryData).filter(o => o.id === val)
        this.dataForm.propertyJson.isTree = item[0].isTree
      }
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        const menuEntityCode = (this.dataForm.entityCode).replace('.', '')
        const moduleId = this.dataForm.propertyJson.moduleId
        if (this.dataForm.category === 'Web') {
          switch (this.dataForm.type) {
            case 3: // 功能
              this.dataForm.urlAddress = `model/${menuEntityCode}`
              break
            case 4: // 字典
              this.dataForm.urlAddress = `dictionary/${menuEntityCode}`
              break
            case 5: // 报表
              this.dataForm.urlAddress = `dataReport/${menuEntityCode}`
              break
            case 6: // 大屏
              this.dataForm.urlAddress = `dataScreen/${menuEntityCode}`
              break
            case 8: // 门户
              this.dataForm.urlAddress = `portal/${menuEntityCode}`
              break
          }
        } else {
          if (this.dataForm.type == 3) {
            this.dataForm.urlAddress = `/pages/apply/dynamicModel/index?id=${moduleId}`
          }
        }
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateMenu : createMenu
          const query = {
            ...this.dataForm,
            propertyJson: JSON.stringify(this.dataForm.propertyJson)
          }
          formMethod(query).then(res => {
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
