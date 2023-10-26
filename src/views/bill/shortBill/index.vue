<template>
  <div class="BL-common-layout">
    <!-- left -->
    <div class="BL-common-layout-left">123</div>
    <!-- right -->
    <div class="BL-common-layout-center BL-flex-main">
      <el-row class="BL-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <input
                v-model.lazy="params.keyword"
                class="el-textarea__inner"
                placeholder="请输入关键词"
                clearable
                @keyup.enter="search"
              >
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>

        <div class="BL-common-head-right">
          <div>
            <el-button icon="el-icon-upload2" :loading="importLoading" @click="importData">导入</el-button>
            <el-button icon="el-icon-download" :loading="exportLoading" @click="exportData">导出</el-button>
            <el-button icon="el-icon-plus" type="primary" @click="addOrUpdateHandle">新建</el-button>
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link
                style="margin-left: 12px;"
                icon="el-icon-refresh"
                :underline="false"
                @click="reset"
              />
            </el-tooltip>
          </div>
        </div>
      </el-row>

      <div class="BL-common-layout-main BL-flex-main">
        <el-table v-loading="tableLoading" class="BL-common-table" :data="tableData" :cell-style="{padding: '0'}" :header-cell-style="{background:'#f5f7fa'}" row-key="id">
          <el-table-column type="index" label="序号" width="50" />
          <template v-for="item in columns">
            <template v-if="item.prop === 'description'">
              <el-table-column :key="item.prop" :label="item.label" width="220">
                <template #default="scope">
                  {{ scope.row.prop }}
                </template>
              </el-table-column>
            </template>
            <template v-else-if="item.prop === 'size'">
              <el-table-column :key="item.prop" :label="item.label" width="120">
                <template #default="scope">
                  {{ scope.row.prop }}
                </template>
              </el-table-column>
            </template>
            <template v-else-if="item.prop === 'action'">
              <el-table-column :key="item.prop" :label="item.label" width="120" fixed="right">
                <template #default="scope">
                  {{ scope.row.prop }}
                </template>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column :key="item.prop" :label="item.label" :prop="item.prop" />
            </template>
          </template>
        </el-table>
        <el-pagination
          class="BL-common-pagination"
          background
          :current-page="params.currentPage"
          :page-sizes="[20, 50, 100, 500]"
          :page-size="20"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShortBill',
  data() {
    return {
      params: {
        keyword: '',
        currentPage: 1,
        pageSize: 20
      },
      total: 100,
      tableLoading: false,
      tableData: [],
      importLoading: false,
      exportLoading: false,
      roleButtonOptions: [],
      roleColumnOptions: [
        {
          label: '装置名称',
          prop: 'name'
        },
        {
          label: '盲板编号',
          prop: 'code'
        },
        {
          label: '管径',
          prop: 'pipDiameter'
        },
        {
          label: '盲板安装位置描述 (注明阀前或阀后)',
          prop: 'description'
        },
        {
          label: '名称',
          prop: 'pipelineMediaName'
        },
        {
          label: '温度 (℃)',
          prop: 'pipelineMediaTemperature'
        },
        {
          label: '压力 (MPa)',
          prop: 'pipelineMediaPressure'
        },
        {
          label: '盲板规格 (mm)',
          prop: 'size'
        },
        {
          label: '盲板形式',
          prop: 'type'
        },
        {
          label: '盲板材质',
          prop: 'material'
        },
        {
          label: '加装时间',
          prop: 'installTime'
        },
        // {
        //   label: '界区系统/装置内部',
        //   prop: 'material'
        // },
        {
          label: '操作人员',
          prop: 'operators'
        },
        {
          label: '管理干部',
          prop: 'Manager'
        },
        {
          label: '操作',
          prop: 'action'
        }
      ]
    }
  },

  computed: {
    columns() {
      return this.roleColumnOptions
    }
  },

  methods: {
    search() {},

    reset() {},

    importData() {},

    exportData() {},

    addOrUpdateHandle() {},

    handleSizeChange() {},

    handleCurrentChange() {}
  }
}
</script>

<style>

</style>
