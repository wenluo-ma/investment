<template>
  <div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="75%" v-dialogDrag append-to-body>
      <el-form v-model="form" label-width="100px" :rules="rules" v-loading="formLoading" ref="form">
        <el-form-item label="研究机构">
          <el-input v-model="form.name" prop="name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.phone" prop="phone"></el-input>
        </el-form-item>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" :disabled="formLoading">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogTitle: null,
      dialogVisible: false,
      formLoading: false,
      form: {
        name: null,
        phone: null,
      },
      rules: {
        name: [
          { required: true, message: "请输入研究机构", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    open(row) {
      console.log(row);

      this.dialogVisible = true;

    },
    submitForm() {
      this.formLoading = true;
      this.$emit("success");
    },
  },
}
</script>
