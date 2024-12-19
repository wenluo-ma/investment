<template>
  <div class="app-container">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="45%" v-dialogDrag append-to-body>
      <el-form ref="formRef" :model="formData" :rules="formRules" v-loading="formLoading" label-width="100px">
        <el-form-item label="名字" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名字" />
        </el-form-item>
        <el-form-item label="描述">
          <Editor v-model="formData.description" :min-height="192" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="0" active>开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
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
import * as GroupApi from '@/api/system/group';
import Editor from '@/components/Editor';
export default {
  name: "GroupForm",
  components: {
    Editor,
  },
  data() {
    return {
      // 弹出层标题
      dialogTitle: "",
      // 是否显示弹出层
      dialogVisible: false,
      // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
      formLoading: false,
      // 表单参数
      formData: {
        id: undefined,
        name: undefined,
        description: undefined,
        status: undefined,
      },
      // 表单校验
      formRules: {
        name: [{ required: true, message: '名字不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
      },
    };
    //校验  密码、邮件、手机号
  },
  methods: {
    /** 打开弹窗 */
    async open(id) {
      this.dialogVisible = true;
      this.reset();
      // 修改时，设置数据
      if (id) {
        this.formLoading = true;
        try {
          const res = await GroupApi.getGroup(id);
          this.formData = res.data;
          this.title = "修改用户组";
        } finally {
          this.formLoading = false;
        }
      }
      this.title = "新增用户组";
    },
    /** 提交按钮 */
    async submitForm() {
      await this.$refs["formRef"].validate();
      this.formLoading = true;
      try {
        const data = this.formData;
        // 修改的提交
        if (data.id) {
          await GroupApi.updateGroup(data);
          this.$modal.msgSuccess("修改成功");
          this.dialogVisible = false;
          this.$emit('success');
          return;
        }
        // 添加的提交
        await GroupApi.createGroup(data);
        this.$modal.msgSuccess("新增成功");
        this.dialogVisible = false;
        this.$emit('success');
      } finally {
        this.formLoading = false;
      }
    },
    /** 表单重置 */
    reset() {
      this.formData = {
        id: undefined,
        name: undefined,
        description: undefined,
        status: undefined,
      };
      this.resetForm("formRef");
    }
  }
};
</script>
