<template>
  <el-dialog :modal-append-to-body="false" title="指派师傅" :visible="true" width="1000px" :before-close="handleClose" :close-on-click-modal="false">
    <div>
      
        <p style="margin-bottom: 10px">请选择一个师傅，该订单将派发给该师傅负责</p>
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
        <gd-pagination style="margin-top:20px" :total="total" :current-page="queryMes.page" :page-size="queryMes.limit" />
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
        limit: 20,
        start_time: '',
        end_time: '',
        name: '',
        sn: '',
        status: '',
        district: '',
        city: '',
        province: '',
      },
      
      listLoading: true,
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

  created() {
    this.againFetch()
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

    againFetch() {
        let queryMes = this.common.deepCopy(this.queryMes)
        let query = this.$route.query
        for (let i in queryMes) {
            if (query.hasOwnProperty(i)) {
                queryMes[i] = query[i]
            } else {
                // queryMes[i] = ''
            }
        }
        queryMes.page = 1
        queryMes.limit = 20

        queryMes.start_time = this.globalSearch.startTime
        queryMes.end_time = this.globalSearch.endTime
        queryMes.network_id = this.globalSearch.network_id
        queryMes.district = this.globalSearch.district
        queryMes.city = this.globalSearch.city
        queryMes.province = this.globalSearch.province
        
        this.queryMes = queryMes
        this.fetchData()
    },

    beforeFetch() {
      this.queryMes.status = 1
    },
    
    // 获取列表
    fetchData() {
        if (this.beforeFetch) {
            const beforeRes = this.beforeFetch()
            if (beforeRes === false) {
                return false
            }
        }
        this.listLoading = true
        this.api.getList(this.queryMes).then(({ data }) => {
            if (this.fetchCallback) {
                this.fetchCallback(data)
            } else {
                this.list = data.data
                this.total = data.total
            }
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
          craftsman_id: id
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
