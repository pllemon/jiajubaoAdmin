<template>
  <div class="app-container list-layout">
    <div class="table-content">
      <!-- 搜索 -->
      <el-form :inline="true" :model="queryMes" size="mini" class="search-form" ref="searchForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="queryMes.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="工号" prop="sn">
          <el-input v-model="queryMes.sn" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="收款账号" prop="pay_name">
          <el-input v-model="queryMes.pay_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="申请状态" prop="status">
          <el-select v-model="queryMes.status" placeholder="请选择">
            <el-option
              v-for="(item, index) in dict.settleStauts"
              :key="index"
              :label="item"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="申请份额" prop="number">
          <el-select v-model="queryMes.number" placeholder="请选择">
            <el-option
              v-for="(item, index) in dict.settlePercent"
              :key="index"
              :label="item"
              :value="index"
            />
          </el-select>
        </el-form-item> -->
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
                <gd-image :src="scope.row.headerurl" headUrl width="40" height="40"/>
                <div style="margin-left:5px">
                  <p>{{scope.row.name}}（{{scope.row.sn}}）</p>
                  <p>{{scope.row.phone}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="相关订单" min-width="160">
            <template slot-scope="scope">
              <span class="link" @click="loadComponent('OrderDetails', scope.row.order_id)">{{scope.row.order_sn}}</span>
            </template>
          </el-table-column>
          <el-table-column label="收款信息" min-width="200">
            <template slot-scope="scope">
              <p>{{scope.row.pay_username}}（{{scope.row.pay_type == 2?'银行卡':'支付宝'}}）</p>
              <p>{{scope.row.pay_name}}</p>
            </template>
          </el-table-column>
          <el-table-column label="申请金额" prop="money" min-width="140"/>
          <el-table-column label="收据图片" prop="shouju_img" min-width="140">
            <template slot-scope="scope">
              <gd-image width="120" height="90" :src="scope.row.shouju_img"/>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" min-width="160" prop="time" />
          <el-table-column label="申请状态" min-width="100">
            <template slot-scope="scope">
              {{ dict.settleStauts[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column label="审核时间" min-width="160" prop="time" />
          <el-table-column label="审核备注" min-width="100" prop="shremark" />
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.status == 0" @click="loadComponent('SettlementExamine', scope.row)">审核</el-button>
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
import { craftsmansettlementlist, craftsmansettlement } from '@/api/master'
import OrderDetails from '@/views/order/details'
import SettlementExamine from '@/views/master/settlementExamine'

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
        name: '',
        pay_name: '',
        number: ''
      },
      api: {
        getList: craftsmansettlementlist
      }
    }
  },
  created() {
    this.againFetch()
  },
  methods: {
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
