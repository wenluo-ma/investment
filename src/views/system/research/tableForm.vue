<template>
  <div class="app-container">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="75%" v-dialogDrag append-to-body>
      <el-form ref="formRef" :model="meets" :rules="formRules" v-loading="formLoading" label-width="200px">
        <el-form-item label="发起投研活动组织机构" prop="researchCompany">
          <el-input type="text" placeholder="请输入内容" v-model="meets.researchCompany" maxlength="200"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="投研活动名称" prop="meetingName">
          <el-input type="text" placeholder="请输入内容" v-model="meets.meetingName" maxlength="200"
            show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="投研活动时间" prop="meetingTime">
          <div class="block">

            <el-date-picker v-model="meets.meetingTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="研究员" prop="researcher">
          <el-input type="text" placeholder="请输入内容" v-model="meets.researcher" maxlength="200"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="调研对象" prop="researchTarget">
          <el-input type="text" placeholder="请输入内容" v-model="meets.researchTarget" maxlength="200"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="会议地址" prop="meetingAddress">
          <el-input type="text" placeholder="请输入内容" v-model="meets.meetingAddress" maxlength="200"
            show-word-limit></el-input>
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
import * as researchAPI from '@/api/system/research'
export default {
  name: 'cardForm',
  data() {
    return {
      dialogTitle: '',
      dialogVisible: false,
      formLoading: false,
      activityId: '',
      meets: {
        id: '',
        avtivityId: '',
        researchCompany: '',
        meetingName: '',
        meetingTime: '',
        researcher: '',
        researchTarget: '',
        meetingAddress: '',
      },
      formRules: {
        researchCompany: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        meetingName: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        meetingTime: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        researcher: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        researchTarget: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        meetingAddress: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open(row,activityId) {
      this.avtivityId = activityId
      this.dialogVisible = true
      this.reset()
      if (row) {
        this.dialogTitle = '编辑'
        this.meets = row
      } else {
        this.dialogTitle = '新增'
      }
    },
    reset() {
      this.meets = {
        activityId: this.avtivityId,
        researchCompany: '',
        meetingName: '',
        meetingTime: '',
        researcher: '',
        researchTarget: '',
        meetingAddress: '',
      }
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate()
      })
    },
    async submitForm() {
      console.log(this.meets);

      await this.$refs.formRef.validate()

      try {
        this.formLoading = true
        if (this.meets.id) {
          console.log('meets',this.meets);
          await researchAPI.updateTable(this.meets)
        } else {//新增
          console.log('meets',this.meets);
          await researchAPI.createTable(this.meets)
        }
      } finally {
        this.formLoading = false
        this.dialogVisible = false
        this.$emit('success');
      }
    }
  }
}
</script>
