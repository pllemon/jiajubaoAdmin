<template>
  <div class="app-container list-layout">
    <div class="table-content">
      <!-- 表格&分页 -->
      <div class="search-form">
        <el-form></el-form>
        <div class="other-action">
          <el-button size="mini" type="primary" plain icon="el-icon-plus" round @click="common.loadComponent(vm, 1)">添加</el-button>
        </div>
      </div>
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
          <el-table-column label="工号" prop="sn" />
          <el-table-column label="姓名" prop="name" />
          <el-table-column label="联系电话" prop="phone" />
          <el-table-column label="角色" >
            <template slot-scope="scope">
              {{ownerType[scope.row.type]}}
            </template>
          </el-table-column>
          <el-table-column label="所属网点" >
            <template slot-scope="scope">
              {{scope.row.network_name}}
            </template>
          </el-table-column>
          <!-- <el-table-column label="创建时间" width="200" prop="time" /> -->
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="common.loadComponent(vm, 1, scope.row.id)">编辑</el-button>
              <el-button type="text" @click="updateRecord(scope.row.id, 3)">删除</el-button>
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
import { getList, updateRecord } from '@/api/shopowner'
import Update from '@/views/shopowner/update'

export default {
  data() {
    return {
      vm: this,

      list: null,
      listLoading: true,
      selectArr: [],

      total: 0,
      queryMes: {
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
      getList(this.queryMes).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.$store.commit('user/SET_LISTTOTAL', response.data.total)
      }).finally(() => {
        this.listLoading = false
      })
    },

    updateRecord(id, type) {
      this.common.updateRecord(type, this, {
        id: id,
        is_show: type
      }, updateRecord)
    }
  },
  components: {
    Update
  },
  computed: {
    ...mapState({
      ownerType: state => state.dict.ownerType,
      showType: state => state.dict.showType
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
