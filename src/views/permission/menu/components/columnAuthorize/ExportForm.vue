<template>
  <el-dialog
    :title="$t('system.exportColumns')"
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
      label-position="top"
    >
      <el-form-item :label="$t('system.jsonField')" prop="columnJson">
        <div class="formCodeEditor">
          <HGCodeEditor ref="CodeEditor" :options="options" />
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('system.closeButton') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import HGCodeEditor from '@/components/HGEditor/monaco'

export default {
  components: { HGCodeEditor },
  data() {
    return {
      options: {
        readOnly: true,
        language: 'json'
      },
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        moduleId: '',
        bindTable: '',
        bindTableName: '',
        columnJson: []
      },
      dataRule: {}
    }
  },
  methods: {
    init(definition) {
      this.visible = true
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs.CodeEditor.changeEditor({
          value: definition,
          options: this.options
        })
        this.formLoading = false
      })
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
