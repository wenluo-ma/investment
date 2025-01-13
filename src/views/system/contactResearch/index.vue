<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-select v-model="queryForm.research" placeholder="研究机构" style="width: 240px">
          <el-option value="1">1</el-option>
          <el-option value="2">2</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="queryForm.time" syle="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" />
      </el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button @click="resetQuery">重置</el-button>
    </el-form>
    <el-table :data="tableData" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column align="center" prop="id" label="序号" />
      <el-table-column align="center" prop="research" label="研究机构" />
      <el-table-column align="center" prop="phone" label="联系方式" />
      <el-table-column align="center" label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <editForm ref="editForm" />
  </div>
</template>
<script>
import editForm from './editForm.vue';
export default {
  components: {
    editForm
  },
  name: 'ContactResearch',
  data() {
    return {
      Loading: false,
      startTime: null,
      endTime: null,
      queryForm: {
        research: null,
        time: []
      },
      tableData: [
        {
          id: 1,
          research: '1',
          phone: '1'
        }
      ]
    }
  },
  methods: {
    handleQuery() {

    },
    resetQuery() {

    },
    handleEdit(row) {
      this.$refs.editForm.open(row)
    },
    handleDelete(row) {

    }
  }
}
</script>
