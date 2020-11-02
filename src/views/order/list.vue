<template>
  <div class="app-container list-layout">
    <div class="table-content">
      <!-- 搜索 -->
      <div class="search-form">
        <el-form :inline="true" :model="queryMes" size="mini" ref="searchForm">
          <el-form-item label="订单编号" prop="order_sn">
            <el-input type="text" v-model="queryMes.order_sn" placeholder="请输入"/>
          </el-form-item>
          <!-- <el-form-item label="订单状态" prop="status">
            <el-select v-model="queryMes.status" placeholder="请选择" clearable>
              <el-option
                v-for="(item, index) in dict.orderStatus"
                :key="index"
                :label="item"
                :value="index">
              </el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="师傅佣金状态" prop="cashout_status">
            <el-select v-model="queryMes.cashout_status" placeholder="请选择" clearable>
              <el-option
                v-for="(item, index) in dict.cashoutStatus"
                :key="index"
                :label="item"
                :value="index">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="用户手机" prop="phone">
            <el-input type="text" v-model="queryMes.phone" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="师傅手机" prop="cmphone">
            <el-input type="text" v-model="queryMes.cmphone" placeholder="请输入"/>
          </el-form-item>
          <!-- <el-form-item label="师傅工号" prop="cmsn">
            <el-input type="text" v-model="queryMes.cmsn" placeholder="请输入"/>
          </el-form-item> -->
          <el-form-item label="是否加急" prop="urgent">
            <el-select v-model="queryMes.urgent" placeholder="请选择" clearable>
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search()">搜索</el-button>
            <el-button @click="resetSearch()">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="other-action">
          <!-- <el-button size="mini" type="primary" plain icon="el-icon-upload2" round  @click="exportExcel()">批量导出</el-button> -->
        </div>
      </div>

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
          <el-table-column label="订单编号"  width="220" prop="order_sn">
            <template slot-scope="scope">
              {{scope.row.order_sn}}
            </template>
          </el-table-column>
          <el-table-column label="订单状态" width="120">
            <template slot-scope="scope">
              {{dict.orderStatus[scope.row.status]}}
            </template>
          </el-table-column>
          <el-table-column label="下单客户" width="150">
            <template slot-scope="scope">
              <p>{{scope.row.username}}</p> 
              <p>{{scope.row.phone}}</p>
            </template>
          </el-table-column>
          <el-table-column label="服务需求" prop="service_demand" width="200"/>
          <el-table-column label="是否加急" prop="urgent" width="100" align="center">
            <template slot-scope="scope">
              <svg-icon v-if="scope.row.urgent == 1" icon-class="urgent" title="加急" />
            </template>
          </el-table-column>
          <el-table-column label="服务地址" prop="address" width="200"/>
          <el-table-column label="预约时间"  prop="appo_time" width="180" />
          <el-table-column label="维修详述" prop="remark" width="120" />
          <el-table-column label="服务网点" prop="networkname" width="120" />
          <el-table-column label="承接师傅"  width="200">
            <template slot-scope="scope">
              <p>{{scope.row.cmsn}} {{scope.row.cmname}}</p> 
              <p>{{scope.row.cmphone}}</p>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="create_time" width="180" />
          <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="loadComponent('Details', scope.row.order_id)">详情</el-button>
              <el-button type="text" v-if="scope.row.status == 1 && !scope.row.network_id" @click="loadComponent('Examine', {type:0, id:scope.row.order_id})">分配</el-button>
              <!-- <el-button type="text" v-if="scope.row.status == 1 && scope.row.appo_time" @click="loadComponent('Examine', {type:1, id:scope.row.order_id})">报价</el-button> -->
              <el-button type="text" v-if="scope.row.status == 4" @click="loadComponent('Appoint', scope.row.order_id)">指派</el-button>
              <el-button type="text" v-if="scope.row.status == 3" @click="release(scope.row.order_id)">发布</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <gd-pagination :total="total" :current-page="queryMes.page" :page-size="queryMes.limit" />
    </div>

    <!-- 弹窗 -->
    <component :is="currentComponent" :dialogMes="dialogMes"/>

    <!-- 导出 -->
    <form ref="exportForm" action="/admin/orderlist" method="post" style="display:none">
      <input name="model" value="exportToExcel" />
      <input v-if="this.queryMes.start_time" name="start_time" :value="this.queryMes.start_time" />
      <input v-if="this.queryMes.end_time" name="end_time" :value="this.queryMes.end_time" />
      <div></div>
    </form>
  </div>
</template>

<script>
import ListMixin from '@/mixin/list'
import { getList, release } from '@/api/order'
import Details from '@/views/order/details'
import Examine from '@/views/order/examine'
import Appoint from '@/views/order/appoint'
import { menuData } from '@/utils/menu'

export default {
  mixins: [ListMixin],
  components: {
    Details,
    Examine,
    Appoint
  },
  data() {
    return {
      queryMes: {
        status: '',
        order_sn: '',
        phone: '',
        cmphone: '',
        cmsn: '',
        urgent: '',
        cashout_status: ''
      },
      
      api: {
        getList,
        release
      },
    }
  },
  created() {
    this.againFetch()
  },
  methods: {
    // 发布订单
    release(id) {
      this.$confirm('确定发布该订单？发布后该订单将显示在抢单中心，师傅可以进行报名。', '提示', {
        type: 'warning'
      }).then(() => {
        this.api.release({
          order_id: id
        }).then(response => {
          this.common.notify()
          this.fetchData()
        })
      })
    },
  }
}
</script>
