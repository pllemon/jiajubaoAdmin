<template>
  <el-dialog :modal-append-to-body="false" :title="dialogMes.id?'编辑':'新增'" :visible="true" width="600px" :before-close="handleClose" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" style="margin: 0 40px" v-loading="loading">
       <el-form-item label="展示图片(400*400)" required>
        <gd-upload 
          v-if="!loading"
          :file="file" 
          :autoUpload="false" 
          width="180" 
          height="180" 
          action="#"
          @change="changeFile"
        />
      </el-form-item>
      <el-form-item label="类目名称" prop="type_name">
        <el-input v-model="form.type_name" />
      </el-form-item>
      <el-form-item label="排序" prop="orders">
        <el-input v-model="form.orders" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getDetails, updateRecord } from '@/api/category'

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

      file: {},
      form: {
        id: '',
        type_name: '',
        orders: '',
        status: 1
      },
      rules: {
        type_name: [{ required: true, message: '请输入类目名称', trigger: 'blur' }]
      }
    }
  },
  
  created() {
    if (this.dialogMes.id) {
      this.form.id = this.dialogMes.id
      this.getDetails()
    } else {
      this.loading = false
    }
  },

  methods: {
    getDetails() {
      getDetails({
        id: this.dialogMes.id
      }).then(response => {
        const { data } = response
        this.file.url = this.common.ip + data.imgurl
        this.form = data
      }).finally(() => {
        this.loading = false
      })
    },

    changeFile(file) {
      this.file = file
    },

    handleClose() {
      this.$parent.currentComponent = ''
    },

    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = new FormData()
          for (let i in this.form) {
            formData.append(i, this.form[i])
          }
          if (this.file.raw) {
            formData.append('imgurl', this.file.raw)
          } else if (!this.file.url) {
            this.$message.error('请上传图片')
            return false
          }
          
          this.loading = true
          updateRecord(formData, this.form.id).then(response => {
            this.common.closeComponent(this)
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
  }
}
</script>
