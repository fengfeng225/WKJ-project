<template>
  <el-table
    ref="BLTable"
    :data="data"
    :height="height"
    :cell-style="{padding: '0'}"
    v-bind="$attrs"
    :border="border"
    v-on="$listeners"
  >
    <el-table-column v-if="hasC" type="selection" width="50" align="center" />
    <el-table-column v-if="hasNO" type="index" width="50" label="序号" align="center" :fixed="fixedNO" />
    <slot />
    <template slot="empty">
      <el-empty description="暂无数据" :image-size="120" />
    </template>
  </el-table>
</template>

<script>
export default {
  name: 'BLTable',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columnData: {
      type: Array,
      default: () => []
    },
    // 序号 默认有
    hasNO: {
      type: Boolean,
      default: true
    },
    // 多选框 默认无
    hasC: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '100%'
    },
    fixedNO: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    data: {
      handler(val) {
        if (!val) return
        this.doLayout()
      },
      deep: true
    },
    columnData: {
      handler(val) {
        if (!val) return
        this.doLayout()
      },
      deep: true
    }
  },
  methods: {
    doLayout() {
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.$refs.BLTable) this.$refs.BLTable.doLayout()
        })
      }, 50)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table__column-filter-trigger {
    .el-icon-arrow-down {
        position: relative;
        top: 4px;
        &:before {
            font-family: "ym-custom" !important;
            content: '\e8a2';
            font-size: 20px;
        }
    }
}
</style>
