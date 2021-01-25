<template>
  <el-dialog :modal-append-to-body="false" title="审核师傅" :visible="true" width="600px" :before-close="handleClose" :close-on-click-modal="false">
    <el-form ref="form" :model="form" label-width="140px" style="margin-right: 50px">
      <el-form-item label="审核结果：" required>
        <el-radio-group v-model="form.status" @change="changeStatus">
          <el-radio label="1">通过</el-radio>
          <el-radio label="3">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="师傅头像：" prop="headerurl" v-show="form.status == '1'">
        <gd-upload 
          ref="upload"
          action='/admin/uploadcmauthorurl'
          :file="file"  
          @success="uploadSuccess"
        />
      </el-form-item> -->
      <el-form-item label="师傅工号：" prop="sn"  v-show="form.status == '1'">
        <el-input type="text" v-model="form.sn" />
      </el-form-item>
      <el-form-item label="所属区域：" prop="areaCode" v-show="form.status == '1'">
        <el-cascader
          ref="areaCascader"
          v-model="area.code"
          style="width:100%"
          :options="options"
          @change="changeArea"
        />
      </el-form-item>
      <el-form-item label="不通过原因：" prop="reject_reason" v-show="form.status == '3'">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6 }"
          placeholder="请输入"
          v-model="form.reject_reason"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitExamine">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { areaJson } from '@/utils/area.js'
import { getDetails, craftsmanexamine } from '@/api/master'  

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

      file: {},
      form: {
        areaCode: '440000,440700,440783',
        areaCodeName: '广东省,江门市,开平市',
        status: '1',
        sn: '',
        craftsman_id: '',
        user_id: '',
        imglist: '',
        reject_reason: '',
        sn: ''
      },
      area: {
        code: ['440000', '440700', '440783'],
        codeName: ['广东省', '江门市', '开平市']
      }
    }
  },
  created() {
    const that = this
    getDetails({
      id: that.dialogMes.id
    }).then(response => {
      that.form.craftsman_id = response.data.info.id
      that.form.user_id = response.data.info.user_id
    })
  },
  methods: {
    changeArea(val) {
      const nodes = this.$refs.areaCascader.getCheckedNodes()
      const region = nodes[0].parent.parent.label + ',' + nodes[0].parent.label + ',' + nodes[0].label
      this.form.areaCode = val.join(',')
      this.form.areaCodeName = region
    },

    changeStatus(val) {
      return false
      if (val == 1) {
        this.form.reject_reason = ''
      } else {
        this.form.sn = ''
        this.file.url = ''
      }
      this.$refs.form.resetFields()
      this.$refs.form.clearValidate() 
    },

    uploadSuccess(data) {
      this.form.headerurl = data
    },

    handleClose() {
      this.$parent.currentComponent = ''
    },

    submitExamine() {
      const that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          let obj = null
          if (that.form.status == 1) {
            obj = {
              status: 1,
              areaCode: that.form.areaCode,
              areaCodeName: that.form.areaCodeName,
              user_id: that.form.user_id,
              craftsman_id: that.form.craftsman_id,
              sn: that.form.sn,
              imglist: ''
            }
          } else {
            obj = {
              sn: '',
              user_id: that.form.user_id,
              craftsman_id: that.form.craftsman_id,
              status: 3,
              reject_reason: that.form.reject_reason
            }
          }
          craftsmanexamine(obj).then(response => {
            that.common.closeComponent(that)
          })
        }
      })
    }
  }
}
</script>