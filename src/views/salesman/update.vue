<template>
  <el-dialog :modal-append-to-body="false" :title="dialogMes.id?'编辑':'新增'" :visible="true" width="600px" :before-close="handleClose" :close-on-click-modal="false">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" v-loading="loading">
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
          <el-form-item label="提成比率" prop="lilu">
            <el-input-number v-model="form.lilu" :precision="2" :step="1" :min="0" :max="100" />
            <span>%</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属区域" prop="city">
            <el-select v-model="form.province" placeholder="请选择" @change="changeProvince" style="width:200px">
              <el-option v-for="(item, index) in provinceList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="form.city" placeholder="请选择" style="width:200px">
              <el-option v-for="(item, index) in cityList" :key="index" :label="item.label" :value="item.value" />
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
import { areaJson } from '@/utils/area.js'
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
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        city: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
        lilu: [{ required: true, message: '请输入提成比率', trigger: 'change' }],
      },
      form: {
        id: '',
        phone: '',
        name: '',
        addressstr: '',
        province: '',
        city: '',
        lilu: 1.00
      },
      provinceList: areaJson,
      cityList: []
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
    changeProvince() {
      this.form.city = ''
      this.getCitys()
    },

    getCitys() {
      this.cityList = []
      let index = areaJson.findIndex(item => {
        return item.value == this.form.province
      })
      if (index != -1) {
        this.cityList = areaJson[index].children
      }
    },

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
