<template>
  <div class="app-container">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%" v-dialogDrag append-to-body>
      <el-form :model="queryForms" ref="queryForms" size="small" :rules="formRules" v-loading="formLoading">
        <el-form-item label="排序依据" prop="sort">
          <el-select placeholder="点击量" clearable size="small" v-model="queryForms.sort">
            <el-option label="从多到少" value="DESC" />
            <el-option label="从少到多" value="ASC" />
          </el-select>
        </el-form-item>
        <el-form-item label="更新频率" prop="updata">
          <el-select clearable size="small" v-model="queryForms.updata">
            <el-option label="1小时" value=1 />
            <el-option label="3小时" value=3 />
            <el-option label="6小时" value=6 />
            <el-option label="12小时" value=12 />
            <el-option label="24小时" value=24 />
          </el-select>
        </el-form-item>
        <el-form-item label="统计范围" prop="range">
          <el-select clearable size="small" v-model="queryForms.range">
            <el-option label="近1天" value=1 />
            <el-option label="近7天" value=7 />
            <el-option label="近15天" value=15 />
            <el-option label="近30天" value=30 />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'WordConfig',
  data() {
    return {
      dialogTitle: '',
      dialogVisible: false,
      formLoading: false,
      queryForms: {
        sort: null,
        updata: null,
        range: null,
      },
      formRules: {
        sort: [{ required: true, message: '请选择排序依据', trigger: 'change' }],
        updata: [{ required: true, message: '请选择更新频率', trigger: 'change' }],
        range: [{ required: true, message: '请选择统计范围', trigger: 'change' }]
      }
    }
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    async submitForm() {
      await this.$refs["queryForms"].validate();
      try {
        //校验表单

        this.formLoading = true
        //this.queryForms.range转为数字
        this.queryForms.range = parseInt(this.queryForms.range);
        //this.queryForms.updata转为数字
        this.queryForms.updata = parseInt(this.queryForms.updata);
        console.log(this.queryForms.range);
        console.log(this.queryForms.sort);
        console.log(this.queryForms.updata);
        //传给父组件
        this.$emit('success', { range: this.queryForms.range, sort: this.queryForms.sort, updata: this.queryForms.updata });
      } catch (error) {
        console.log(error);
      }
      finally {
        this.formLoading = false
        this.dialogVisible = false
        this.resetForm('queryForms')
      }
    },
  }
}
</script>
