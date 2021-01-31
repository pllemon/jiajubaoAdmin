<template>
  <div class="app-container list-layout">
    <div class="table-content">
      <!-- 搜索 -->
      <div class="search-form">
        <el-form />
        <div class="other-action">
          <el-button size="mini" type="primary" plain icon="el-icon-plus" round @click="loadComponent('Update', {})">添加</el-button>
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
          <el-table-column label="展示图片" width="280">
            <template slot-scope="scope">
              <gd-image width="160" height="90" :src="scope.row.imgurl"/>
            </template>
          </el-table-column>
          <el-table-column label="类目名称" prop="type_name" />
          <el-table-column label="排序" prop="orders" />
          <el-table-column label="操作">
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
import ListMixin from '@/mixin/list'
import { mapState } from 'vuex'
import { getList, updateServertype } from '@/api/category'
import Update from '@/views/system/category/update'

export default {
  mixins: [ListMixin],
  components: {
    Update
  },
  data() {
    return {
      vm: this,
      queryMes: {
        name: '',
        region: '',
        author: '',
        is_show: '',
        page: 1,
        limit: 20
      },

      api: {
        getList
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    updateRecord(id, type) {
      this.common.updateRecord(type, this, {
        id,
        status: 3
      }, updateServertype)
    }
  }
}
</script>
