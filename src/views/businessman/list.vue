<template>
  <div class="app-container list-layout">
    <div class="table-content">
      <!-- 搜索 -->
      <div class="search-form">
        <el-form :inline="true" :model="queryMes" size="mini" class="search-form" ref="searchForm">
          <el-form-item label="店铺名" prop="name">
            <el-input v-model="queryMes.name" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="queryMes.phone" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="关联网点" prop="network_id" v-if="!userInfo.network_id">
            <el-select v-model="queryMes.network_id" clearable>
              <el-option v-for="(item, index) in networkList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="店铺地址" prop="address">
            <el-input v-model="queryMes.address" placeholder="请输入" />
          </el-form-item>   -->
          <el-form-item label="店铺状态" prop="status">
            <el-select v-model="queryMes.status" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in dict.businessStatus" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺属性" prop="attribute">
            <el-select v-model="queryMes.attribute" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in dict.businessAttr" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search()">搜索</el-button>
            <el-button @click="resetSearch()">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="other-action">
          <!-- <el-button size="mini" type="primary" plain icon="el-icon-upload2" round  @click="exportExcel()">批量导出</el-button> -->
          <!-- <el-button size="mini" type="primary" plain icon="el-icon-money" round  @click="loadComponent('GoodPrice')">设置商品价格</el-button> -->
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
          <el-table-column label="店铺门面" width="120">
            <template slot-scope="scope">
              <gd-image :src="scope.row.shopimg" small/>
            </template>
          </el-table-column>
          <el-table-column label="店铺名" prop="name" width="120" />
          <el-table-column label="联系方式" prop="phone" width="120" />
          <el-table-column label="店铺地址" prop="address" min-width="160" />
          <el-table-column label="加盟费用" min-width="100" prop="joininprice" />
          <el-table-column label="商品数量" prop="goodsnumber" min-width="100" />
          <el-table-column label="关联网点" min-width="120" prop="network_name"/>
          <el-table-column label="店铺状态" min-width="120">
            <template slot-scope="scope">
              {{ dict.businessStatus[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column label="店铺属性" min-width="120">
            <template slot-scope="scope">
              {{ dict.businessAttr[scope.row.attribute] }}
            </template>
          </el-table-column>
          <el-table-column label="申请时间" min-width="160" prop="creattime" />
          <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="loadComponent('Details', scope.row.id)">详情</el-button>
              <el-button type="text" v-if="scope.row.status == 1" @click="loadComponent('Update', scope.row)">编辑属性</el-button>
              <el-button type="text" v-if="scope.row.status == 2" @click="loadComponent('Examine', scope.row.id)">审核</el-button>
              <el-button type="text" v-if="scope.row.status == 4" @click="updateStatus({busines_id:scope.row.id, status:1})">启用</el-button>
              <el-button type="text" v-if="scope.row.status == 1" @click="updateStatus({busines_id:scope.row.id, status:4})">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <gd-pagination :total="total" :current-page="queryMes.page" :page-size="queryMes.limit" />
    </div>

    <!-- 弹窗 -->
    <component :is="currentComponent" :dialogMes="dialogMes"/>

    <!-- 导出 -->
    <form ref="exportForm" action="/admin/businesslist" method="post" style="display:none">
      <input name="model" value="exportToExcel" />
      <input v-if="this.queryMes.start_time" name="start_time" :value="this.queryMes.start_time" />
      <input v-if="this.queryMes.end_time" name="end_time" :value="this.queryMes.end_time" />
      <div></div>
    </form>
  </div>
</template>

<script>
import ListMixin from '@/mixin/list'
import { getList, savebusinessstatus } from '@/api/businessman'
import Details from '@/views/businessman/details'
import Examine from '@/views/businessman/examine'
import Update from '@/views/businessman/update'
import GoodPrice from '@/views/businessman/goodPrice'

export default {
  mixins: [ListMixin],
  components: {
    Details,
    Examine,
    GoodPrice,
    Update
  },
  data() {
    return {
      queryMes: {
        page: 1,
        limit: 20,
        name: '',
        phone: '',
        address: '',
        status: '',
        district: '',
        city: '',
        province: '',
        network_id: '',
        attribute: ''
      },
      networkList: [],

      api: {
        getList,
        enable: savebusinessstatus
      }
    }
  },
  created() {
    this.common.getAllNetwork(this)
    this.againFetch()
  }
}
</script>
