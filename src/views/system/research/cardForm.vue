<template>
  <div class="app-container">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="75%" v-dialogDrag append-to-body>
      <el-form ref="formRef" :model="cards" :rules="formRules" v-loading="formLoading" label-width="200px">
        <el-form-item label="发起投研活动组织机构" prop="organizer">
          <el-input type="text" placeholder="请输入内容" v-model="cards.organizer" maxlength="200"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="投研活动名称" prop="activityName">
          <el-input type="text" placeholder="请输入内容" v-model="cards.activityName" maxlength="200"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="调研行业" prop="industry">
          <el-input type="text" placeholder="请输入内容" v-model="cards.industry" maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="投研活动时间" prop="activityTime">
            <el-date-picker v-model="cards.activityTime" type="daterange" range-separator="-" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
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
      cards: {},
      formRules: {
        organizer: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        activityName: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        activityTime: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async open(item) {
      this.dialogVisible = true
      this.reset()
      if (item) {
        this.dialogTitle = '编辑'
        this.cards = item
        console.log(this.cards);
        this.$nextTick(() => {
          this.$refs.formRef.clearValidate()
        })

      } else {
        this.dialogTitle = '新增'
      }
    },
    reset() {
      this.cards = {}
    },
    async submitForm() {
      console.log(this.cards);

      await this.$refs.formRef.validate()

      try {
        this.formLoading = true
        if (this.cards.id) {//修改
          this.cards.startTime = this.cards.activityTime[0]
          this.cards.endTime = this.cards.activityTime[1]
          delete this.cards.activityTime
          await researchAPI.updateCrad(this.cards)
        }
        else {//新增
          this.cards.startTime = this.cards.activityTime[0]
          this.cards.endTime = this.cards.activityTime[1]
          delete this.cards.activityTime
          await researchAPI.createCrad(this.cards)
        }
      } catch (error) {
        console.log(error);
      }
      finally {
        this.$emit('success');
        this.formLoading = false
        this.dialogVisible = false

      }

    },

  }
}
</script>
