<template>
  <el-dialog
    title="批量新增"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    lock-scroll
    width="600px"
    @close="close"
  >
    <el-form
      ref="dataForm"
      v-loading="formLoading"
      :model="dataForm"
      label-width="80px"
      label-position="top"
    >
      <div class="json-demo">
        <pre>
          // 示例
          [
            {
              "fullName":"名称",
              "entityCode":"fullName"
            }
          ]
        </pre>
      </div>
      <el-form-item label="字段Json">
        <div class="formCodeEditor">
          <BLCodeEditor ref="CodeEditor" v-model="content" :options="options" />
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { batchCreateColumn } from '@/api/system/columnAuthorize'
import BLCodeEditor from '@/components/BLEditor'

export default {
  components: { BLCodeEditor },
  data() {
    return {
      options: {
        readOnly: false,
        language: 'json'
      },
      visible: false,
      formLoading: false,
      btnLoading: false,
      content: '',
      dataForm: {
        moduleId: '',
        columnJson: []
      }
    }
  },
  methods: {
    init(moduleId) {
      this.dataForm.moduleId = moduleId
      this.visible = true
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs.CodeEditor.changeEditor({
          value: '',
          options: this.options
        })
        this.formLoading = false
      })
    },
    dataFormSubmit() {
      const rtnData = this.content
      if (!rtnData) return this.$message.warning('请输入字段JSON')

      const fixedRtnData = rtnData.replace(/("\w+":)(?=[},])/g, '$1null')
      const jsonData = JSON.parse(fixedRtnData)
      this.dataForm.columnJson = jsonData

      this.btnLoading = true
      batchCreateColumn(this.dataForm).then(res => {
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
      }).catch(() => { this.btnLoading = false })
    },

    close() {
      this.content = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.formCodeEditor {
  width: 100%;
  height: 260px;
  margin: 0;
  padding: 0;
  border: 1px solid #c0c4cc;
  overflow: hidden;
}
.json-demo {
  width: 100%;
  background: #f4f4f5;
  border-radius: 4px;
  color: #909399;
  padding-top: 10px;
  pre {
    margin-left: -40px;
    font-size: 12px;
  }
}
</style>
