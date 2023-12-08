<template>
  <el-drawer
    title="检查记录"
    :visible.sync="drawer"
    :close-on-press-escape="false"
    :wrapper-closable="false"
    @closed="close"
  >
    <div class="records-drawer">
      <div class="search-box">
        <div>
          <label class="record-type-label">台账类别</label>
          <el-select v-model="type">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      </div>
      <el-divider />
      <el-timeline>
        <el-timeline-item
          v-for="item in 2"
          :key="item"
          icon="el-icon-check"
          type="success"
          size="large"
          timestamp="2018/4/12"
          placement="top"
        >
          <el-card>
            <div class="basic">
              <h4 style="font-size: 16px;">1月检查</h4>
              <div class="user-info">
                <table>
                  <tr>
                    <td align="right">检查人员：</td>
                    <td><span style="margin-left:8px;">王小虎</span></td>
                  </tr>
                  <tr>
                    <td align="right">检查时间：</td>
                    <td><span style="margin-left:8px;">2018/4/12 20:46</span></td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="remark">处理备注：已处理</div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-drawer>
</template>

<script>
import { getCheckRecords } from '@/api/scheduledTask/billCheck'

export default {
  data() {
    return {
      drawer: false,
      loading: false,
      id: '',
      type: '',
      typeList: [],
      recordList: []
    }
  },

  methods: {
    init(id, typeList) {
      this.id = id
      this.typeList = typeList
      this.drawer = true
    },

    search() {
      this.loading = true
      getCheckRecords(this.id, this.type).then(res => {
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

<style lang="scss" scoped>
.records-drawer {
  height: 100%;
  padding: 10px;
  padding-top: 0;
  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .record-type-label {
      line-height: 32px;
      font-size: 14px;
      font-weight: 400;
      color: #606266;
      width: 80px;
      margin-right: 10px;
    }
  }
  .basic {
    width: 50%;
    .user-info {
      display: flex;
      justify-content: flex-end;
      padding-top: 10px;
      table {
        color: #909399;
        font-size: 12px;
      }
  }
  }
  .remark {
    width: 50%;
    margin-left: 5px;
    text-align: right;
    word-break: break-all;
  }
}
::v-deep .el-card__body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}
</style>
