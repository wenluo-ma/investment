<template>
  <div>
    <el-radio-group v-model="meeting" size="large">
      <el-radio-button label="董事会职责设置" value="1" />
      <el-radio-button label="监事会职责设置" value="2" />
      <el-radio-button label="股东会职责设置" value="3" />
      <el-radio-button label="专门委员会职责设置" value="4" />
      <el-radio-button label="独立董事专门会议职责设置" value="5" />
      <el-radio-button label="职工代表大会职责设置" value="6" />
    </el-radio-group>
    <el-form :inline="true" v-show="meeting === '专门委员会职责设置'">
      <hr>
      <el-form-item label="会议类型">
        <el-select v-model="specialCommitteeOption">
          <el-option label="审计委员会" value="审计委员会"></el-option>
          <el-option label="提名委员会" value="提名委员会"></el-option>
          <el-option label="薪酬与考核委员会" value="薪酬与考核委员会"></el-option>
          <el-option label="战略委员会" value="战略委员会"></el-option>
          <el-option label="ESG委员会" value="ESG委员会"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" size="large" @click="handleSpecialCommitteeSelect">查询</el-button>
      <el-button size="large" @click="reset">重置</el-button>
    </el-form>
    <br>
    <hr>
    <el-button type="primary" size="large" @click="addRow">添加</el-button>

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="id" label="序号"></el-table-column>
      <el-table-column v-if="meeting === '专门委员会职责设置'" align="center" prop="meetingType" label="会议类型"></el-table-column>
      <el-table-column align="center" prop="role" label="职责内容"></el-table-column>
      <el-table-column align="center" prop="creator" label="创建人"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updater" label="更新人"></el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editRow(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="pageNo" :limit.sync="pageSize" @pagination="getList" />
    <editForm ref="editForm" @success="getList" />
  </div>
</template>
<script>
import editForm from './editForm.vue';
import * as responsibilitiesApi from '@/api/system/responsibilities'
export default {
  components: { editForm },
  data() {
    return {
      total: 0,
      pageNo: 1,
      pageSize: 10,
      //会议职责设置选择
      meeting: "董事会职责设置",


      //专门委员会的二级选择
      specialCommitteeOption: null,


      tableData: [],
      loading: false,
    }
  },
  created() {
    this.getList(this.meeting)
  },
  watch: {
    meeting(val) {
      console.log(val)
      this.pageNo = 1
      this.pageSize = 10
      this.getList(val)
    },
  },
  methods: {
    async getList() {
      const apiMap = {
        "董事会职责设置": responsibilitiesApi.getDirectorate,
        "监事会职责设置": responsibilitiesApi.getSupervisory,
        "股东会职责设置": responsibilitiesApi.getShareholders,
        "专门委员会职责设置": responsibilitiesApi.getSpecialCommittee,
        "独立董事专门会议职责设置": responsibilitiesApi.getIndepentdire,
        "职工代表大会职责设置": responsibilitiesApi.getEmployee,
      };

      try {
        this.loading = true;
        const api = apiMap[this.meeting];
        const res = await api({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        });
        this.tableData = res.data.list;
        this.total = res.data.total;
      } finally {
        this.loading = false;
      }
    },
    async handleSpecialCommitteeSelect() {
      console.log(this.specialCommitteeOption)
      //把specialCommitteeOption传给后端
      try {
        this.loading = true;
        const res = await responsibilitiesApi.getSpecialCommittee({
          meetingType: this.specialCommitteeOption,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        })
        this.tableData = res.data.list;
      } finally {
        this.loading = false;
      }

    },

    reset() {
      this.specialCommitteeOption = null;
      this.getList(this.meeting)
    },
    async deleteRow(row) {
      await this.$modal.confirm('是否确认删除?')
      const apiMap = {
        "董事会职责设置": responsibilitiesApi.deleteDirectorate,
        "监事会职责设置": responsibilitiesApi.deleteSupervisory,
        "股东会职责设置": responsibilitiesApi.deleteShareholders,
        "专门委员会职责设置": responsibilitiesApi.deleteSpecialCommittee,
        "独立董事专门会议职责设置": responsibilitiesApi.deleteIndepentdire,
        "职工代表大会职责设置": responsibilitiesApi.deleteEmployee,
      };
      try {
        this.loading = true;
        const api = apiMap[this.meeting];
        await api({
          id: row.id,
        });
      } finally {
        this.loading = false;
        this.getList(this.meeting);
      }
    },
    editRow(row) {
      this.$refs.editForm.open(row.id, this.meeting);
    },
    addRow() {
      this.$refs.editForm.open(null, this.meeting);
    }
  }
}


</script>
