<template>
  <div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="75%" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" label-width="80px" :rules="meeting === '专门委员会职责设置' ? specialRules : rules">
        <!-- <el-form-item label="会议类型" prop="meetingType" v-if="meeting==='专门委员会职责设置'">
          <el-input v-model="form.meetingType"></el-input>
        </el-form-item> -->
        <el-form-item label="会议类型" prop="meetingType" v-if="meeting === '专门委员会职责设置'">
          <el-select v-model="form.meetingType" placeholder="请选择会议类型">
            <el-option label="审计委员会" value="审计委员会"></el-option>
            <el-option label="提名委员会" value="提名委员会"></el-option>
            <el-option label="薪酬与考核委员会" value="薪酬与考核委员会"></el-option>
            <el-option label="战略委员会" value="战略委员会"></el-option>
            <el-option label="ESG委员会" value="ESG委员会"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职责内容" prop="role">
          <el-input v-model="form.role"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="formLoading">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as responsibilitiesApi from '@/api/system/responsibilities'
import { getUserProfile } from "@/api/system/user";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitle: null,
      formLoading: false,
      meeting: null,
      id: null,
      form: {
        meetingType: null,
        role: null,
        updater: null,
        creator: null
      },
      specialRules: {
        meetingType: [
          { required: true, message: '请输入会议类型', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请输入职责内容', trigger: 'blur' }
        ]
      },
      rules: {
        role: [
          { required: true, message: '请输入职责内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async open(id, meeting) {
      this.form = {}
      this.meeting = meeting
      this.dialogVisible = true
      this.dialogTitle = id ? '修改' : '新增'
      this.id = id
      console.log(id);

      if (id) {
        const apiMap = {
          "董事会职责设置": responsibilitiesApi.getDirectorate,
          "监事会职责设置": responsibilitiesApi.getSupervisory,
          "股东会职责设置": responsibilitiesApi.getShareholders,
          "专门委员会职责设置": responsibilitiesApi.getSpecialCommittee,
          "独立董事专门会议职责设置": responsibilitiesApi.getIndepentdire,
          "职工代表大会职责设置": responsibilitiesApi.getEmployee,
        };

        try {
          this.formLoading = true;
          const api = apiMap[this.meeting];
          const res = await api({
            id
          });
          this.form = res.data.list[0];

        } finally {
          this.formLoading = false;
        }
      }


    },
    async submitForm() {
      this.$refs["form"].validate()
      const updateApiMap = {
        "董事会职责设置": responsibilitiesApi.updateDirectorate,
        "监事会职责设置": responsibilitiesApi.updateSupervisory,
        "股东会职责设置": responsibilitiesApi.updateShareholders,
        "专门委员会职责设置": responsibilitiesApi.updateSpecialCommittee,
        "独立董事专门会议职责设置": responsibilitiesApi.updateIndepentdire,
        "职工代表大会职责设置": responsibilitiesApi.updateEmployee,
      };
      const createApiMap = {
        "董事会职责设置": responsibilitiesApi.createDirectorate,
        "监事会职责设置": responsibilitiesApi.createSupervisory,
        "股东会职责设置": responsibilitiesApi.createShareholders,
        "专门委员会职责设置": responsibilitiesApi.createSpecialCommittee,
        "独立董事专门会议职责设置": responsibilitiesApi.createIndepentdire,
        "职工代表大会职责设置": responsibilitiesApi.createEmployee,
      };

      try {
        this.formLoading = true;
        const user = await getUserProfile()

        if(this.id){
          //更新
          this.form.updater = user.data.nickname
          const api = updateApiMap[this.meeting];
          await api(this.form);
        }else{
          //新增
          this.form.creator = user.data.nickname
          this.form.updater = user.data.nickname
          const api = createApiMap[this.meeting];
          await api(this.form);
        }

      } finally {
        this.formLoading = false;
        this.$message.success("操作成功");
        this.dialogVisible = false
        this.$emit("success");

      }
    }
  }
}

</script>
