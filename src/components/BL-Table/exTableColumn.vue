<script>
import { TableColumn } from 'element-ui'
import {
  parseMinWidth
} from 'element-ui/packages/table/src/util.js'
import { max, map, isEmpty } from './util'

export default {
  name: 'ExTableColumn',
  extends: TableColumn, // 指定继承组件
  props: {
    fitByClass: {
      type: String,
      default: 'cell'
    },
    autoFit: {
      type: Boolean,
      default: true
    },
    fitGap: {
      type: Number,
      default: 0
    },
    fitHeader: {
      type: Boolean,
      default: true
    },
    maxWidth: {
      type: Number,
      default: Infinity
    },
    className: {
      type: String,
      default: 'ex-column'
    },
    loadNewLine: {
      type: String,
      default: 'newline'
    }
  },
  data() {
    return {
      autoWidth: 0
    }
  },
  computed: {
    realMinWidth() {
      if (this.autoFit) {
        return parseMinWidth(max([this.minWidth, this.autoWidth]))
      }
      return TableColumn.computed.realMinWidth.call(this)
    }
  },
  watch: {

  },
  updated() {
    this.updateAutoWidth()
  },
  mounted() {
    this.$nextTick(this.updateAutoWidth)
  },
  methods: {
    updateAutoWidth() {
      if (!this.autoFit) return

      const cellWrapperClass = this.fitHeader ? `.${this.columnId}` : `td.${this.columnId}`

      let cells = window.document.querySelectorAll(`${cellWrapperClass} .${this.fitByClass}`)

      if (isEmpty(cells)) {
        cells = window.document.querySelectorAll(`${cellWrapperClass} .cell`)
      }
      if (isEmpty(cells)) {
        return
      }

      let autoMinWidth = max(map(cells, item => item.getBoundingClientRect().width)) + this.fitGap + 1
      autoMinWidth = Math.min(autoMinWidth, this.maxWidth)

      if (this.autoWidth !== autoMinWidth) {
        this.autoWidth = autoMinWidth
      }
    }
  }
}
</script>

<style>
.ex-column .cell {
  white-space: nowrap!important;
  width: fit-content!important;
}
.el-table--enable-row-transition .el-table__body td.ex-column {
  overflow: hidden;
}
</style>
