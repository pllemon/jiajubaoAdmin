<template>
  <div class="app-container list-layout">
    <div class="table-content">
      <!-- 搜索 -->
      <div class="search-form">
        <el-form :inline="true" :model="queryMes" size="mini"  ref="searchForm">
          <el-form-item label="账号名" prop="username">
            <el-input v-model="queryMes.username" clearable/>
          </el-form-item>
          <!-- <el-form-item label="账号角色" prop="role">
            <el-select v-model="queryMes.role" clearable>
              <el-option v-for="(item, index) in roleType" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="所属网点" prop="network_id">
            <el-select v-model="queryMes.network_id" clearable>
              <el-option v-for="(item, index) in networkList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryMes.status" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in showType" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="common.search(vm)">搜索</el-button>
            <el-button @click="common.resetSearch(vm)">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="other-action">
          <el-button size="mini" type="primary" plain icon="el-icon-plus" round @click="common.loadComponent(vm, 1)" v-if="userInfo.username == 'dsf'">添加</el-button>
        </div>
      </div>

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
          <el-table-column label="账号名" prop="username" />
          <el-table-column label="联系电话" prop="phone" />
          <!-- <el-table-column label="账号角色" width="150">
            <template slot-scope="scope">
              {{roleType[scope.row.role]}}
            </template>
          </el-table-column>
          <el-table-column label="所属网点" width="150">
            <template slot-scope="scope">
              {{scope.row.network_id}}
            </template>
          </el-table-column> -->
          <el-table-column label="账号备注" prop="remark" />
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{ showType[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="create_time" />
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="common.loadComponent(vm, 1, scope.row.id)"  v-if="userInfo.username == 'dsf' && scope.row.username != 'dsf'">编辑</el-button>
              <el-button type="text" v-if="scope.row.status == 2 && userInfo.username == 'dsf' && scope.row.username != 'dsf'" @click="updateRecord(scope.row.id, 1)">启用</el-button>
              <el-button type="text" v-if="scope.row.status == 1 && userInfo.username == 'dsf' && scope.row.username != 'dsf'" @click="updateRecord(scope.row.id, 2)">禁用</el-button>
              <el-button type="text" @click="updateRecord(scope.row.id, 3)"  v-if="userInfo.username == 'dsf' && scope.row.username != 'dsf'">删除</el-button>
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
import { mapState } from 'vuex'
import { getAccountList, updateStatus } from '@/api/account'
import Update from '@/views/setting/account/update'

export default {
  data() {
    return {
      vm: this,

      list: null,
      listLoading: true,
      selectArr: [],

      total: 0,
      queryMes: {
        username: '',
        network_id: '',
        role: '',
        status: '',
        page: 1,
        limit: 20
      },

      currentComponent: '',
      dialogMes: {},

      networkList: []
    }
  },
  created() {
    const that = this
    this.common.getAllNetwork(this, function(){
      that.fetchData()
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAccountList(this.queryMes).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.$store.commit('user/SET_LISTTOTAL', response.data.total)
      }).finally(() => {
        this.listLoading = false
      })
    },

    updateRecord(id, type) {
      this.common.updateRecord(type, this, {
        admin_id: id,
        status: type
      }, updateStatus)
    }
  },
  components: {
    Update
  },
  computed: {
    ...mapState({
      roleType: state => state.dict.roleType,
      showType: state => state.dict.showType,
      userInfo: state => state.user.userInfo
    }),
    networkArr() {
      let networkObj = {}
      this.networkList.forEach(item => {
        networkObj[item.id] = item.name
      })
      return networkObj
    }
  }
}
</script>
