<template>
  <el-dialog :modal-append-to-body="false" title="指派师傅" :visible="true" width="1000px" :before-close="handleClose" :close-on-click-modal="false">
    <div>
        <p style="margin-bottom: 10px">请选择一个师傅，该订单将派发给该师傅负责</p>
        <el-form :inline="true" :model="queryMes" size="mini" ref="searchForm">
          <el-form-item label="师傅手机号"  prop="phone">
            <el-input v-model="queryMes.phone" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="师傅工号"  prop="sn">
            <el-input v-model="queryMes.sn" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search()">搜索</el-button>
            <el-button @click="resetSearch()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="table"
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          height="400px"
        >
          <el-table-column label="序号" type="index" width="50" fixed/>
          <el-table-column label="姓名">
            <template slot-scope="scope">
              <p class="flex-center-start">
                <gd-image :src="scope.row.headerurl" headUrl width="40" height="40" style="margin-right:10px"/>
                <span>{{scope.row.name}}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="sn" />
          <el-table-column label="手机号" prop="phone" />
          <el-table-column label="区域" prop="areacodename" />
          <el-table-column label="操作" width="80px">
            <template slot-scope="scope">
              <el-button type="text" @click="choose(scope.row.id)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <gd-pagination style="margin-top:20px" :total="total" :current-page="queryMes.page" :page-size="queryMes.limit" /> -->
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { orderlist, choosecraftsman } from '@/api/order'
import { getList } from '@/api/master'

export default {
  props: {
    dialogMes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      queryMes: {
        page: 1,
        limit: 1000,
        phone: '',
        sn: '',
        status: ''
      },
      
      listLoading: false,
      list: [],
      total: 0,
      api: {
        getList
      }
    }
  },
  computed: {
    ...mapState({
      orderStatus: state => state.dict.orderStatus
    }),
    ...mapGetters(['userInfo', 'globalSearch'])
  },

  methods: {
    // 搜索
    search() {
        this.queryMes.page = 1
        this.fetchData()
    },

    // 重置
    resetSearch() {
        this.$refs.searchForm.resetFields()
        this.queryMes.page = 1
        this.fetchData()
    },

    // 获取列表
    fetchData() {
        if (this.queryMes.phone == '' && this.queryMes.sn == '') {
          this.list = []
          this.total = 0
          return false;
        }
        this.queryMes.status = 1
        this.listLoading = true
        this.api.getList(this.queryMes).then(({ data }) => {
            this.list = data.data.filter(item => {
              let isPhone = true
              let isSn = true
              if (this.queryMes.phone && item.phone != this.queryMes.phone) {
                isPhone = false
              }
              if (this.queryMes.sn && item.sn != this.queryMes.sn) {
                isSn = false
              }
              return isPhone && isSn
            })
            // this.total = data.total
            this.$nextTick(() => {
                this.$refs.table.bodyWrapper.scrollTop = 0
            })
        }).finally(() => {
            this.listLoading = false
        })
    },

    handleClose() {
      this.$parent.currentComponent = ''
    },

    choose(id) {
      this.$confirm('确定选择该师傅?', '提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        choosecraftsman({
          order_id: this.dialogMes.id,
          craftsman_id: id,
          zdchoose: 1
        }).then(response => {
          this.common.closeComponent(this)
        }).finally(() => {
          this.loading = false
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss">
.master-list{
  display: flex;
  flex-wrap: wrap;
  li{
    width: 32%;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    line-height: 1.5;
    margin-right: 2%;
    padding: 10px;
    box-sizing: border-box;
    &:nth-of-type(3n){
      margin-right: 0;
    }
  }
}
</style>
