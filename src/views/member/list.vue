<template>
  <div class="app-container list-layout">
    <div class="table-content">
      <div class="search-form">
        <el-form :inline="true" :model="queryMes" size="mini" ref="searchForm">
          <el-form-item label="用户账号" prop="phone">
            <el-input v-model="queryMes.phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="queryMes.username" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="上级推荐码" prop="invitation_code">
            <el-input v-model="queryMes.invitation_code" placeholder="请输入" />
          </el-form-item>
          <!-- <el-form-item label="师傅状态" prop="is_criaftsman">
            <el-select v-model="queryMes.is_criaftsman" placeholder="请选择">
                <el-option v-for="(item, index) in identityType" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="商家状态" prop="is_business">
            <el-select v-model="queryMes.is_business" placeholder="请选择">
                <el-option v-for="(item, index) in identityType" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="common.search(vm)">搜索</el-button>
            <el-button @click="common.resetSearch(vm)">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="other-action">
          <!-- <el-button size="small" icon="el-icon-upload2" round>批量导出</el-button> -->
          <el-button size="mini" type="primary" plain icon="el-icon-discount" round @click="changePoints(1, selectIds)">积分增减</el-button>
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
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="序号" type="index" width="50" fixed/>
          <el-table-column label="用户头像" align="center" width="100">
            <template slot-scope="scope">
              <gd-image :src="scope.row.headerurl" headUrl width="40" height="40"/>
            </template>
          </el-table-column>
          <el-table-column label="用户账号" prop="phone" />
          <el-table-column label="用户名" prop="username"/>
          <el-table-column label="性别">
            <template slot-scope="scope">
              {{ sexOptions[scope.row.sex] }}
            </template>
          </el-table-column>
          <el-table-column label="下级推荐码" prop="invitation_code"/>
          <!-- <el-table-column label="上级推荐人" width="120" prop="invitation_code"/> -->
          <el-table-column label="下级推荐数" prop="friend_sum"/>
          <!-- <el-table-column label="下单数" /> -->
          <!-- <el-table-column label="总积分" /> -->
          <el-table-column label="账号状态">
            <template slot-scope="scope">
              {{ identityType[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column label="师傅状态">
            <template slot-scope="scope">
              {{ identityType[scope.row.is_criaftsman] }}
            </template>
          </el-table-column>
          <el-table-column label="商家状态">
            <template slot-scope="scope">
              {{ identityType[scope.row.is_business] }}
            </template>
          </el-table-column>
          <el-table-column label="注册时间" width="200" prop="creattime" />
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="common.loadComponent(vm, 0, scope.row.user_id)">详情</el-button>
              <el-button type="text" @click="changePoints(2, [scope.row.user_id])">积分增减</el-button>
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
import { getList } from '@/api/member'
import Details from '@/views/member/details'
import DispatchingPoints from '@/views/member/dispatchingPoints'

export default {
  data() {
    return {
      vm: this,

      list: null,
      listLoading: true,
      selectArr: [],

      total: 0,
      queryMes: {
        phone: '',
        username: '',
        invitation_code: '',
        is_criaftsman: '',
        is_business: '',
        page: 1,
        limit: 20
      },
      sexOptions: {
        1: '男',
        2: '女'
      },

      currentComponent: '',
      dialogMes: {}
    }
  },
  computed: {
    ...mapState({
      identityType: state => state.dict.identityType
    }),
    selectIds() {
      let idsArr = this.selectArr.map(item => {
        return item.user_id
      })
      return idsArr
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    selectionChange(val) {
      this.selectArr = val
    },

    fetchData() {
      this.listLoading = true
      getList(this.queryMes).then(response => {
        this.list = response.data.data
        this.total = response.data.total
      }).finally(() => {
        this.listLoading = false
      })
    },

    changePoints(type, ids) {
      if (type == 1 && ids.length == 0) {
        this.$message.error('请至少选择一名用户')
        return false
      }
      console.log(ids)
      this.dialogMes = {
        ids: ids
      }
      this.currentComponent = 'DispatchingPoints'
    }
  },
  components: {
    Details,
    DispatchingPoints
  }
}
</script>
