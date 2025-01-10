<template>
  <el-dialog :visible.sync="dialogVisible">
    <el-form :model="formData" v-loading="formLoading">
      <el-form-item prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="'已通过'">通过</el-radio>
          <el-radio :label="'已驳回'">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审批意见">
        <el-input type="textarea" v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 60%;">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>
<script>
import * as flowApi from "@/api/system/flow";
export default {
  data() {
    return {
      formLoading : false,
      dialogVisible: false,
      formData: {
        id: null,
        status: "",
        description: "",
      }
    }


  },
  methods: {
    open(id) {
      this.dialogVisible = true
      this.formData.id = id
    },
    resetForm() {

      this.formData = {
        id: null,
        status: "",
        description: '',
        time: null
      }
      console.log('reset', this.formData);
    },
    async submitForm() {
      try {
        this.formLoading = true
        console.log(this.formData);
        //获得时间戳
        this.formData.time = new Date().getTime()

        await flowApi.updateStatus(this.formData)

        this.$emit('success')
      } finally {
        this.resetForm()
        this.formLoading = false
        this.dialogVisible = false
      }

    },

  }

}
</script>
<style></style>
