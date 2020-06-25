// 用于列表页
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            listLoading: true,
            list: [],
            queryMes: {
                page: 1,
                limit: 10
            },
            total: 0,

            currentComponent: '',
            dialogMes: {}
        }
    },
    methods: {
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
                this.list = data.data
                this.total = data.total
                this.$nextTick(() => {
                    this.$refs.table.bodyWrapper.scrollTop = 0
                })
            }).finally(() => {
                this.listLoading = false
            })
        },

        // 启用禁用
        updateStatus(obj) {
            let text = obj.status == 1 ? '启用' : '禁用'
            this.$confirm(`确定${text}该条记录？`, '提示', {
                type: 'warning'
              }).then(() => {
                this.api.enable(obj).then(() => {
                  this.common.notify()
                  this.fetchData()
                })
              }).catch(() => {
                console.log('取消')
            })
        },

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

        // 加载组件
        loadComponent(name, data) {
            if (data) {
                if (typeof data == 'string' || typeof data == 'number') {
                    this.dialogMes = {
                        id: data
                    }
                } else {
                    this.dialogMes = data
                }
            } else {
                this.dialogMes = null
            }
            this.currentComponent = name
        },

        // 导出
        exportExcel() {
            $(this.$refs.exportForm).find('div').html('')
            for (let i in this.queryMes) {
              if (this.queryMes[i] != '' && i != 'page' && i != 'limit') {
               $(this.$refs.exportForm).find('div').append(
                 `<input type="text" name="${i}" value="${this.queryMes[i]}"/>`
               ) 
              }
            }
            $(this.$refs.exportForm).submit()
        }
    },
    computed: {
        ...mapState(['dict']),
        ...mapGetters(['userInfo', 'globalSearch'])
    }
}
