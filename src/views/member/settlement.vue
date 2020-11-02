<template>
  <div class="app-container list-layout">
    <div class="table-content">
      <!-- 搜索 -->
      <el-form :inline="true" :model="queryMes" size="mini" class="search-form" ref="searchForm">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="queryMes.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="收款人" prop="pay_username">
          <el-input v-model="queryMes.pay_username" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="收款账号" prop="pay_name">
          <el-input v-model="queryMes.pay_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="申请状态" prop="status">
          <el-select v-model="queryMes.status" placeholder="请选择">
            <el-option
              v-for="(item, index) in dict.settleStauts2"
              :key="index"
              :label="item"
              :value="index"
            />
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
          <el-table-column label="申请人" min-width="200">
            <template slot-scope="scope">
              <div class="flex-center-start">
                <!-- <gd-image :src="scope.row.headerurl" headUrl width="40" height="40"/> -->
                <div style="margin-left:5px">
                  <p>{{scope.row.username}}</p>
                  <p>{{scope.row.phone}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="收款信息" min-width="200">
            <template slot-scope="scope">
              <p>{{scope.row.pay_username}}（{{scope.row.pay_type == 2?'银行卡':'支付宝'}}）</p>
              <p>{{scope.row.pay_name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="申请金额" prop="money" min-width="140" />
          <el-table-column label="申请时间" min-width="200" prop="createtime" />
          <el-table-column label="申请状态">
            <template slot-scope="scope">
              {{ dict.settleStauts2[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column label="审核时间" min-width="200" prop="pay_time" />
          <el-table-column label="审核备注" min-width="200" prop="shremark" />
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.status == 1" @click="loadComponent('SettlementExamine', scope.row)">审核</el-button>
            </template>
          </el-table-column>
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
import { userwithdrawallist } from '@/api/member'
import OrderDetails from '@/views/order/details'
import SettlementExamine from '@/views/member/settlementExamine'

export default {
  mixins: [ListMixin],
  components: {
    OrderDetails,
    SettlementExamine
  },
  data() {
    return {
      queryMes: {
        status: '',
        pay_username: '',
        phone: '',
        pay_name: ''
      },
      api: {
        getList: userwithdrawallist
      }
    }
  },
  created() {
    this.againFetch()
  },
  methods: {
    surePay(id, status) {
      
    },

    examine() {
      craftsmansettlement({
        slid: '',
        craftsman_id: '',
        status: '',
        shremark: ''
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
