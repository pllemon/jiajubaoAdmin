<template>
  <div class="app-container list-layout">
    <div class="table-content">
      <!-- 搜索 -->
      <el-form :inline="true" :model="queryMes" size="mini" class="search-form" ref="searchForm">
        <el-form-item label="反馈账号" prop="phone">
          <el-input v-model="queryMes.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="common.search(vm)">搜索</el-button>
          <el-button @click="common.resetSearch(vm)">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格&分页 -->
      <div class="table-section">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          height="100%"
        >
          <el-table-column label="序号" type="index" width="50" fixed/>
          <el-table-column label="反馈账号" prop="phone" />
          <el-table-column label="用户名" prop="username" />
          <el-table-column label="反馈内容" prop="feedback" />
          <!-- <el-table-column label="相关订单" prop="order_sn" /> -->
          <el-table-column label="相关订单" min-width="160">
            <template slot-scope="scope">
              <span class="link" @click="loadComponent('OrderDetails', scope.row.order_id)">{{scope.row.order_sn}}</span>
            </template>
          </el-table-column>
          <el-table-column label="反馈时间" prop="time" />
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
import { getList } from '@/api/feedback'
import OrderDetails from '@/views/order/details'

export default {
  mixins: [ListMixin],
  components: {
    OrderDetails
  },
  data() {
    return {
      vm: this,

      list: null,
      listLoading: true,
      selectArr: [],

      total: 0,
      queryMes: {
        phone: '',
        page: 1,
        limit: 20
      },

      currentComponent: '',
      dialogMes: {}
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapState({
      linkType: state => state.dict.linkType
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.queryMes).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.$store.commit('user/SET_LISTTOTAL', response.data.total)
      }).finally(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
