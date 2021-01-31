<template>
  <el-dialog :modal-append-to-body="false" title="审核商家" :visible="true" width="800px" :before-close="handleClose" :close-on-click-modal="false">
    <el-form ref="examineForm" :rules="rules" :model="examineForm" label-width="140px" style="margin-right: 50px">
      <el-form-item label="审核结果：" required>
        <el-radio-group v-model="examineForm.status" @change="changeStatus">
          <el-radio label="1">通过</el-radio>
          <el-radio label="3">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="examineForm.status == '1'">
        <el-form-item label="关联网点：" prop="network_id">
          <el-select v-model="examineForm.network_id" placeholder="请选择" filterable clearable>
            <el-option v-for="(item, index) in networkList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺属性" prop="attribute">
          <el-select v-model="examineForm.attribute" placeholder="请选择">
            <el-option v-for="(item, index) in dict.businessAttr" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="加盟金额：" prop="joininprice">
          <el-input-number v-model="examineForm.joininprice" :precision="2" :step="1"></el-input-number>
        </el-form-item>
      </template>
      <template v-if="examineForm.status == '3'">
        <el-form-item label="不通过原因：">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6}"
            placeholder="请输入"
            v-model="examineForm.bhremark"
          />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitExamine">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { businessexamine } from '@/api/businessman'  

export default {
  props: {
    dialogMes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      examineForm: {
        busines_id: '',
        status: '1',
        bhremark: '',
        joininprice: 0,
        network_id: '',
        attribute: ''
      },
      rules: {
        joininprice: [{ required: true, message: '请输入加盟金额', trigger: 'change' }],
        network_id: [{ required: true, message: '请选择关联网点', trigger: 'change' }],
        attribute: [{ required: true, message: '请选择店铺属性', trigger: 'change' }],
      },
      networkList: []
    }
  },

  created() {
    this.common.getAllNetwork(this)
  },

  computed: {
    ...mapState({
      dict: state => state.dict
    })
  },

  methods: {
    changeStatus(val) {
      if (val == '1') {
        this.examineForm.bhremark = ''
      }
      this.$refs.examineForm.clearValidate() 
    },

    handleClose() {
      this.$parent.currentComponent = ''
    },

    submitExamine() {
      const that = this
      that.examineForm.busines_id = that.dialogMes.id
      that.$refs.examineForm.validate((valid) => {
        if (valid) {
          businessexamine(that.examineForm).then(response => {
            that.common.closeComponent(that)
          })
        }
      })
    }
  }
}
</script>
