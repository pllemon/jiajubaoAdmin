<template>
  <div class="app-container list-layout">
    <div class="table-content">
      <!-- 搜索 -->
      <el-form :inline="true" :model="queryMes" size="mini" class="search-form" ref="searchForm">
        <!-- <el-form-item label="标题" prop="title">
          <el-input v-model="queryMes.title" placeholder="请输入" />
        </el-form-item> -->
        <!-- <el-form-item label="记录来源" prop="type">
          <el-select v-model="queryMes.type" placeholder="请选择">
              <el-option v-for="(item, index) in originType" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="订单编号" prop="order_sn">
          <el-input v-model="queryMes.order_sn" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="施工师傅" prop="name">
          <el-input v-model="queryMes.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
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
          <!-- <el-table-column label="标题" prop="title" /> -->
          <!-- <el-table-column label="描述" prop="dec" /> -->
          <!-- <el-table-column label="记录来源" width="120">
            <template slot-scope="scope">
              {{ originType[scope.row.type ]}}
            </template>
          </el-table-column> -->
          <el-table-column label="施工师傅" prop="crafts_man_name" />
          <el-table-column label="施工前" min-width="140">
            <template slot-scope="scope">
              <gd-image width="120" height="90" :src="scope.row.imgurl1"/>
            </template>
          </el-table-column>
          <el-table-column label="施工后" min-width="140">
            <template slot-scope="scope">
              <gd-image width="120" height="90" :src="scope.row.imgurl3"/>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" min-width="180" prop="time" />
          <el-table-column label="结束时间" min-width="180" prop="secctime" />
          <el-table-column label="订单编号" min-width="200" prop="order_sn"/>
          <el-table-column label="状态" width="180" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.is_show == 1 ? '启用':'禁用'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="loadComponent('Details', scope.row.order_id)">详情</el-button>
              <!-- <el-button type="text" @click="loadComponent('Update', scope.row.id)">编辑</el-button> -->
              <el-button type="text" v-if="scope.row.is_show == 2" @click="updateStatus({show_id:scope.row.id, status:1 ,is_show:1})">启用</el-button>
              <el-button type="text" v-if="scope.row.is_show == 1" @click="updateStatus({show_id:scope.row.id, status:1, is_show:2})">禁用</el-button>
              <!-- <el-button type="text" @click="updateRecord(scope.row.id, 3)">删除</el-button> -->
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
import { mapState } from 'vuex'
import { getList, updateRecordStatus } from '@/api/show'
import Details from '@/views/order/details'
import Update from '@/views/show/update'

export default {
  mixins: [ListMixin],
  components: {
    Details,
    Update
  },
  data() {
    return {
      queryMes: {
        title: '',
        type: '',
        order_sn: '',
        crafts_man_name: '',
        name: '',
      },
      
      api: {
        getList,
        enable: updateRecordStatus
      }
    }
  },
  created() {
    this.againFetch()
  },
  methods: {
    updateRecord(id, type) {
      this.common.updateRecord(type, this, {
        show_id: id,
        savestatus: 1,
        is_show: type
      }, updateRecordStatus)
    }
  }
}
</script>
