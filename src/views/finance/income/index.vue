<template>
  <div class="app-container list-layout">
    <div class="table-content">
      <!-- 搜索 -->
      <el-form :inline="true" :model="queryMes" size="mini" class="search-form" ref="searchForm">
        <el-form-item label="流水号" prop="tran_id">
          <el-input type="text" v-model="queryMes.tran_id" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="收入类型" prop="logtype">
          <el-select v-model="queryMes.logtype" placeholder="请选择">
            <el-option v-for="(item, index) in incomeType1" :key="index" :label="item" :value="index" />
          </el-select>
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
          <el-table-column label="流水号"  min-width="140" prop="tran_id" />
          <el-table-column label="金额" prop="money"/>  
          <el-table-column label="收入类型" min-width="120">
            <template slot-scope="scope">
              {{dict.incomeType1[scope.row.logtype]}}
            </template>
          </el-table-column>
          <el-table-column label="记录时间" min-width="140" prop="createtime" />
          <el-table-column label="相关用户/商家" min-width="120">
            <template slot-scope="scope">
              {{scope.row.usertpyename}}
            </template>
          </el-table-column>
          <!-- <el-table-column label="订单编号" prop="order_sn" min-width="120" /> -->
          <!-- <el-table-column label="所属网点" prop="network_name" /> -->
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
import { mapState } from 'vuex'
import { transactionlog } from '@/api/finance'

export default {
  mixins: [ListMixin],
  data() {
    return {
      queryMes: {
        page: 1,
        limit: 20,
        incometype: 1,
        logtype: '',
        tran_id: ''
      },
      timeRange: [],

      currentComponent: '',
      dialogMes: {},

      api: {
        getList: transactionlog
      }
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapState({
      incomeType1: state => state.dict.incomeType1
    })
  }
}
</script>
