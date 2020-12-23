<template>
  <el-dialog :modal-append-to-body="false" :title="dialogMes.id?'编辑':'新增'" :visible="true" width="680px" :before-close="handleClose">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" style="margin: 0 40px" v-loading="loading">
      <el-form-item label="展示图片(750*350)" required>
        <gd-upload 
          v-if="!loading"
          :file="file" 
          :autoUpload="false" 
          width="320" 
          height="180" 
          action="#"
          @change="changeFile"
        />
      </el-form-item>
      <el-form-item label="展示位置" prop="type">
        <el-radio-group v-model="form.position">
          <el-radio v-for="(item,index) in linkPos" :key="index" :label="index">{{ item }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="链接类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="(item,index) in linkType" :key="index" :label="index">{{ item }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="链接url" prop="url" v-show="form.type != 0">
        <el-input v-model="form.url" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="排序" prop="orders">
        <el-input v-model="form.orders" placeholder="请输入，数字越大越靠后" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { getDetails, updateRecord } from '@/api/advert'  

export default {
  props: {
    dialogMes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var checkUrl = (rule, value, callback) => {
      if (this.form.type != 0 && value == '') {
        return callback(new Error('请输入链接url'))
      } else {
        return callback()
      }
    }

    return {
      vm: this,
      loading: true,

      file: {},
      form: {
        type: '0',
        url: '',
        orders: '',
        position: '1'
      },
      rules: {
        type: [{ required: true, message: '请选择链接类型', trigger: 'change' }],
        url: [{ validator: checkUrl, trigger: 'blur' }]
      }
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
    changeFile(file) {
      this.file = file
    },

    getDetails() {
      getDetails({
        banner_id: this.dialogMes.id
      }).then(response => {
        const { data } = response
        data.type = data.type.toString()
        data.position = data.position.toString()
        data.banner_id = data.id
        this.file.url = this.common.ip + data.imgurl
        this.form = data
      }).finally(() => {
        this.loading = false
      })
    },
    
    handleClose() {
      this.$parent.currentComponent = ''
    },

    submitForm() {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = new FormData()
          if (this.form.type == 0) {
            this.form.url = ''
          }
          for (let i in this.form) {
            formData.append(i, this.form[i])
          }
          if (this.file.raw) {
            formData.append('file', this.file.raw)
          } else if (!this.file.url) {
            this.$message.error('请上传图片')
            return false
          }
          
          let type = this.form.id ? '2' : '1'
          this.loading = true
          updateRecord(formData, type).then(response => {
            this.common.closeComponent(this)
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },

  },
  
  computed: {
    ...mapState({
      linkType: state => state.dict.linkType,
      linkPos: state => state.dict.linkPos
    })
  }
}
</script>

<style scoped lang="scss">
</style>
