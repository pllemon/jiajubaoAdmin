<template>
  <el-dialog :modal-append-to-body="false" title="编辑属性" :visible="true" width="600px" :before-close="handleClose" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" style="margin-right: 50px" v-loading="loading">
      <el-form-item label="关联网点：" prop="network_id">
        <el-select v-model="form.network_id" placeholder="请选择" filterable clearable>
          <el-option v-for="(item, index) in networkList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺属性：" prop="attribute">
        <el-select v-model="form.attribute" placeholder="请选择">
          <el-option v-for="(item, index) in dict.businessAttr" :key="index" :label="item" :value="index" />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" v-show="!loading">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { savebusiness } from '@/api/businessman'

export default {
  props: {
    dialogMes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: true,
      form: {
        busines_id: '',
        network_id: '',
        attribute: ''
      },
      rules: {
        network_id: [{ required: true, message: '请选择关联网点', trigger: 'change' }],
        attribute: [{ required: true, message: '请选择店铺属性', trigger: 'change' }],
      },
      networkList: []
    }
  },
  computed: {
    ...mapState({
      dict: state => state.dict
    })
  },
  created() {
    let that = this
    this.form.busines_id = this.dialogMes.id
    this.form.network_id = this.dialogMes.network_id
    this.form.attribute = this.dialogMes.attribute
    this.common.getAllNetwork(this, function() {
      that.loading = false
    })
  },
  methods: {
    handleClose() {
      this.$parent.currentComponent = ''
    },

    submitForm() {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.loading = true
          savebusiness(that.form).then(response => {
            that.common.closeComponent(this)
          }).finally(() => {
            that.loading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.section{
  margin-bottom: 40px;
  .section-title{
    margin-bottom: 15px;
  }
}
.order-mes{
  display: flex;
  flex-wrap: wrap;
  li{
    width: 33.33%;
    margin-bottom: 15px;
    box-sizing: border-box;
    font-weight: bold;
    label{
      margin-bottom: 5px;
      display: block;
      font-weight: normal;
    }
  }
}

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
    img{
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
      background: #f2f2f2;
    }
  }
}
</style>
