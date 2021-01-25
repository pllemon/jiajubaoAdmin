<template>
  <el-dialog :modal-append-to-body="false" :title="dialogMes.id?'编辑':'新增'" :visible="true" width="600px" :before-close="handleClose" :close-on-click-modal="false">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" v-loading="loading">
      <el-row>
        <el-col :span="24">
          <el-form-item label="工号" prop="sn">
            <el-input v-model="form.sn" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色" prop="type">
             <el-select v-model="form.type">
              <el-option v-for="(item, index) in ownerType" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属网点" prop="network_id" clearable>
            <el-select v-model="form.network_id">
              <el-option v-for="(item, index) in networkList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { getDetails, updateRecord } from '@/api/shopowner'
import { getNetworkList } from '@/api/network'

export default {
  props: {
    dialogMes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      vm: this,
      loading: true,
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        network_id: [{ required: true, message: '请选择所属网点', trigger: 'change' }],
        type: [{ required: true, message: '请选择角色', trigger: 'change' }],
      },
      form: {
        id: '',
        phone: '',
        type: '',
        name: '',
        headerimg: '',
        network_id: ''
      },
      networkList: []
    }
  },
  computed: {
    ...mapState({
      ownerType: state => state.dict.ownerType
    })
  },
  created() {
    this.common.getAllNetwork(this)
    if (this.dialogMes.id) {
      this.getDetails()
    } else {
      this.loading = false
    }
  },
  methods: {
    handleClose() {
      this.$parent.currentComponent = ''
    },

    getDetails() {
      getDetails({
        id: this.dialogMes.id
      }).then(response => {
        const { data } = response
        data.type = data.type.toString()
        this.form = data
      }).finally(() => {
        this.loading = false
      })
    },

    submit() {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.loading = true
          updateRecord(that.form).then(response => {
            that.common.closeComponent(that)
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

</style>
