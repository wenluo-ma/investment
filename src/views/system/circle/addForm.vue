<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="75%" v-dialogDrag append-to-body>
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="新闻标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="简评" prop="comment">
        <el-input v-model="form.comment"></el-input>
      </el-form-item>
      <el-form-item label="发布时间" prop="startTime">
        <el-date-picker v-model="form.startTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="链接地址" prop="url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>

</template>
<script>
import * as circleAPI from '@/api/system/circle'
import { getUserProfile } from "@/api/system/user";
export default {
  data() {
    return {
      formLoading: false,
      dialogVisible: false,
      nickname: null,
      id: null,
      dialogTitle:null,
      form: {
      },
      rules: {
        title: [
          { required: true, message: '请输入新闻标题', trigger: 'blur' }
        ],
        comment: [
          { required: true, message: '请输入简评', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择发布时间', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入链接地址', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    async submitForm() {
      await this.$refs.form.validate()
      try {

        this.formLoading = true
        if (this.id) {
          this.dialogTitle = '修改'
          this.form.updater = this.nickname

          await circleAPI.update(this.form)
          this.$message.success('修改成功')
        }else{
          this.dialogTitle = '添加'
          this.form.creator = this.nickname
          this.form.updater= this.nickname
          await circleAPI.add(this.form)
          this.$message.success('添加成功')
        }
          this.$emit('success')
      } finally {
        this.dialogVisible = false
        this.formLoading = false
      }
    },
    async open(id) {
      this.id = id
      //获取用户名
      const user = await getUserProfile()
      this.nickname = user.data.nickname

      this.dialogVisible = true
      this.form = {
      }
      if (id) {

        try {
          this.formLoading = true
          const res = await circleAPI.getTablePage({ id })
          this.form = res.data.list[0]
        } finally {
          this.formLoading = false
        }
      }
    }
  }
}
</script>
