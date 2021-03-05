<template>
  <el-dialog :modal-append-to-body="false" :title="dialogMes.id?'编辑':'新增'" :visible="true" width="600px" :before-close="handleClose" :close-on-click-modal="false">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" v-loading="loading">
      <el-row>
        <el-col :span="24">
          <el-form-item label="账号" prop="phone">
            <el-input v-model="form.phone" clearable :disabled="dialogMes.id" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" clearable />
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
import { getDetails, updateRecord } from '@/api/salesman'

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
        username: [{ required: true, message: '请输入', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入', trigger: 'blur' }],
        password: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
      form: {
        id: '',
        username: '',
        phone: '',
        password: '',
      },
    }
  },
  created() {
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
        this.form = data
        this.getCitys()
      }).finally(() => {
        this.loading = false
      })
    },

    submit() {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          let proviceObj = that.provinceList.find(item => {
            return item.value == that.form.province
          })
          let cityObj = that.cityList.find(item => {
            return item.value == that.form.city
          })
          that.form.addressstr = proviceObj.label + cityObj.label
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
