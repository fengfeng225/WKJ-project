<template>
  <el-drawer
    title="我是标题"
    :visible.sync="drawer"
    :close-on-press-escape="false"
    :wrapper-closable="false"
    size="40%"
    @closed="close"
  >
    <span>我来啦!</span>
  </el-drawer>
</template>

<script>
import { getCheckRecords } from '@/api/scheduledTask/billCheck'

export default {
  data() {
    return {
      drawer: false,
      loading: false,
      recordList: []
    }
  },

  methods: {
    init(id) {
      this.drawer = true
      this.loading = true
      getCheckRecords(id).then(res => {
        this.recordList = res.data.list
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    close() {
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>
