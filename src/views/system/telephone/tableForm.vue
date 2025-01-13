<template>
  <div class="app-container">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="75%" v-dialogDrag append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" v-loading="formLoading" label-width="200px">
        <el-form-item label="电话会议时间" prop="meetingTime">
          <el-date-picker v-model="form.meetingTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="调研公司" prop="company">
          <el-input v-model="form.company" placeholder="请输入调研公司" />
        </el-form-item>
        <el-form-item label="电话参会" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="参会密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="formLoading">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as telephoneAPI from '@/api/system/telephone'
export default {
  data() {
    return {
      dialogTitle: "",
      dialogVisible: false,
      formLoading: false,
      form: {
        id: null,
        meetingTime: null,
        company: null,
        telephone: null,
        password: null,
      },
      rules: {
        meetingTime: [
          { required: true, message: "请选择时间", trigger: "blur" },
        ],
        company: [
          { required: true, message: "请输入调研公司", trigger: "blur" },
        ],
        telephone: [
          { required: true, message: "请输入电话", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],

      },
    };
  },
  methods: {
    async open(row) {
      this.resetForm("formRef")
      this.form = {}
      this.dialogVisible = true;
      this.dialogTitle = row ? "修改电话会议动态" : "添加电话会议动态";
      if (row) {
        await telephoneAPI.getTableList({ id: row.id }).then((res) => {
          this.form = res.data.list[0]
        })
      }

    },
    async submitForm() {
      await this.$refs.formRef.validate()
      try {
        this.formLoading = true
        if (this.form.id) {
          await telephoneAPI.updateTable(this.form)
        } else {
          await telephoneAPI.addTable(this.form)
        }
        this.$message.success("操作成功")
        this.dialogVisible = false
        this.$emit("success")
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.formLoading = false
      }

    }
  }
}
</script>
