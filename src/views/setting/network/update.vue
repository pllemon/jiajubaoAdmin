<template>
  <el-dialog :modal-append-to-body="false" :title="dialogMes.id?'编辑':'新增'" :visible="true" width="800px" :before-close="handleClose" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" style="margin-right: 50px" v-loading="loading">
      <el-form-item label="网点名称：" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="所属区域：" prop="areaCode" v-if="!loading">
        <el-cascader
          ref="areaCascader"
          v-model="form.areaCode"
          style="width:100%"
          :options="options"
          @change="changeArea"
        />
      </el-form-item>
      <!-- <el-form-item label="负责人：" prop="author">
        <el-input v-model="form.author" />
      </el-form-item>
      <el-form-item label="联系电话：" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item> -->
      <el-form-item label="网点地址：" prop="address">
        <el-input v-model="form.address" />
      </el-form-item>
      <el-form-item label="店长描述：" prop="desc">
        <el-input
          v-model="form.desc"
          type="textarea"
          :autosize="{ minRows: 6}"
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { areaJson } from '@/utils/area.js'
import { getDetails, updateRecord } from '@/api/network'

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
      options: areaJson,

      form: {
        areaCode: ['440000', '440700', '440783'],
        region: '广东省江门市开平市',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: '请输入网点名称', trigger: 'blur' }],
        areaCode: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
        author: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        address: [{ required: true, message: '请输入网点地址', trigger: 'blur' }]
      },
      orderInfo: {}
    }
  },

  computed: {
    ...mapState({
      changeType: state => state.dict.changeType
    })
  },

  created() {
    if (this.dialogMes.id) {
      this.getDetails()
    } else {
      this.loading = false
    }
  },

  methods: {
    changeArea(val) {
      const nodes = this.$refs.areaCascader.getCheckedNodes()
      const region = nodes[0].parent.parent.label + nodes[0].parent.label + nodes[0].label
      this.form.areaCode = val
      this.form.region = region
      console.log(val, region)
    },

    getDetails() {
      getDetails({
        network_id: this.dialogMes.id
      }).then(response => {
        const { data } = response
        data.areaCode = [data.province, data.city, data.district]
        this.form = data
      }).finally(() => {
        this.loading = false
      })
    },

    handleClose() {
      this.$parent.currentComponent = ''
    },

    submit() {
      const that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          that.form.province = that.form.areaCode[0]
          that.form.city = that.form.areaCode[1]
          that.form.district = that.form.areaCode[2]
          if (that.form.id) {
            that.form.model = 'saveinfo'
            that.form.network_id = that.form.id
          }
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
