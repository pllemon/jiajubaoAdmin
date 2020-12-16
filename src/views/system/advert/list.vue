<template>
  <div class="app-container list-layout">
    <div class="table-content">
      <!-- 搜索 -->
      <div class="search-form">
        <el-form :inline="true" :model="queryMes" size="mini" ref="searchForm">
          <el-form-item label="链接类型" prop="type">
            <el-select v-model="queryMes.type" placeholder="请选择">
              <el-option v-for="(item, index) in linkType" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="链接位置" prop="position">
            <el-select v-model="queryMes.position" placeholder="请选择">
              <el-option v-for="(item, index) in linkPos" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="is_show">
            <el-select v-model="queryMes.is_show" placeholder="请选择">
              <el-option v-for="(item, index) in showType" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="common.search(vm)">搜索</el-button>
            <el-button @click="common.resetSearch(vm)">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="other-action">
          <el-button size="mini" type="primary" plain icon="el-icon-plus" round @click="common.loadComponent(vm, 1)">添加</el-button>
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
          <el-table-column label="展示图片" width="180">
            <template slot-scope="scope">
              <gd-image width="160" height="90" :src="scope.row.imgurl"/>
            </template>
          </el-table-column>
          <el-table-column label="展示位置">
            <template slot-scope="scope">
              {{ linkPos[scope.row.position] }}
            </template>
          </el-table-column>
          <el-table-column label="链接类型">
            <template slot-scope="scope">
              {{ linkType[scope.row.type] }}
            </template>
          </el-table-column>
          <el-table-column label="链接url">
            <template slot-scope="scope">
              {{ scope.row.url || '无' }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{ showType[scope.row.is_show] }}
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="orders"/>
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="common.loadComponent(vm, 1, scope.row.id)">编辑</el-button>
              <el-button type="text" v-if="scope.row.is_show == 2" @click="updateRecord(scope.row.id, 1)">启用</el-button>
              <el-button type="text" v-if="scope.row.is_show == 1" @click="updateRecord(scope.row.id, 2)">禁用</el-button>
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
import { getList, updatebannerstatus } from '@/api/advert'
import Update from '@/views/system/advert/update'

export default {
  components: {
    Update
  },
  data() {
    return {
      vm: this,

      list: null,
      listLoading: true,
      selectArr: [],

      total: 0,
      queryMes: {
        type: '',
        is_show: '',
        page: 1,
        limit: 20,
        position: ''
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
      linkType: state => state.dict.linkType,
      showType: state => state.dict.showType,
      linkPos: state => state.dict.linkPos
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.queryMes).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.$store.commit('user/SET_LISTTOTAL', response.data.total)
        this.listLoading = false
      })
    },

    updateRecord(id, type) {
      this.common.updateRecord(type, this, {
        banner_id: id,
        is_show: type
      }, updatebannerstatus)
    }
  }
}
</script>
