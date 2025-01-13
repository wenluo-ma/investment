<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="75%" v-dialogDrag append-to-body>
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="交易所" prop="exchange">
        <el-input v-model="form.exchange" disabled></el-input>
      </el-form-item>
      <el-form-item label="休市安排" prop="url">
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
import * as arrangementApi from '@/api/system/arrangement'
import { getUserProfile } from "@/api/system/user";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitle: null,
      formLoading: false,
      form: {
      },
      rules: {
        url: [{ required: true, message: '请输入休市安排', trigger: 'blur' }],
      },
    };
  },
  methods: {
    async open(id) {
      this.dialogTitle = "编辑休市安排";
      this.dialogVisible = true;
      try {
        this.formLoading = true;
        const res = await arrangementApi.getTablePage({ id });
        this.form = res.data.list[0];

        const user = await getUserProfile()

        this.form.updater = user.data.nickname
      } finally {
        this.formLoading = false;
      }
    },
    async submitForm() {
      this.$refs["form"].validate()



      try {
        this.formLoading = true;
        await arrangementApi.update(
          {
            updater: this.nickname,
            ...this.form
          });
        this.$message.success("修改成功");
        this.dialogVisible = false;
        this.$emit("success");
      } finally {
        this.dialogVisible = false;
      }
    }
  }
}
</script>
