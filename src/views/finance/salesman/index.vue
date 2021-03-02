<template>
  <div class="app-container list-layout">
    <div class="table-content">
      <!-- 搜索 -->
      <el-form :inline="true" :model="queryMes" size="mini" class="search-form" ref="searchForm">
        <el-form-item label="业务工号" prop="tran_id">
          <el-input type="text" v-model="queryMes.tran_id" placeholder="请输入"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">搜索</el-button>
          <el-button @click="resetSearch()">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格&分页 -->
      <div class="table-section">
        <el-table
          ref="table"
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          height="100%"
        >
          <el-table-column label="序号" type="index" width="50" fixed/>
          <el-table-column label="业务工号" prop=""/>
          <el-table-column label="业务姓名" prop=""/>
          <el-table-column label="流水金额" prop=""/>
          <el-table-column label="记录时间" min-width="140" prop="createtime" />
          <el-table-column label="相关商家" min-width="120" prop="" />
          <el-table-column label="订单编号" prop="order_sn" min-width="120" />
        </el-table>
      </div>
      <gd-pagination :total="total" :current-page="queryMes.page" :page-size="queryMes.limit" />
    </div>

    <!-- 弹窗 -->
    <component :is="currentComponent" :dialogMes="dialogMes"/>
  </div>
</template>

<script>
import ListMixin from '@/mixin/list'
import { salesmantransactionlog } from '@/api/finance'

export default {
  mixins: [ListMixin],
  data() {
    return {
      queryMes: {
        logtype: '',
        tran_id: ''
      },
      timeRange: [],

      currentComponent: '',
      dialogMes: {},

      api: {
        getList: salesmantransactionlog
      }
    }
  },
  created() {
    this.againFetch()
  }
}
</script>
