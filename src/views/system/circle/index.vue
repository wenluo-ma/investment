<template>
  <div class="app-container">
    <el-form :inline="true" v-model="queryform">
      <el-form-item prop="title">
        <el-input placeholder="请输入内容" v-model="queryform.title" icon="el-icon-search" clearable
          @keyup.enter.native="handleQuery">
        </el-input>
      </el-form-item>
      <el-form-item prop="time">
        <el-date-picker v-model="queryform.time" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" align="right"
          unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleTableAdd">添加</el-button>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="tableLoading">
      <el-table-column align="center" prop="id" label="序号"></el-table-column>
      <el-table-column align="center" prop="title" label="新闻标题"></el-table-column>
      <el-table-column align="center" prop="comment" label="简评"></el-table-column>
      <el-table-column align="center" prop="startTime" label="发布时间"></el-table-column>
      <el-table-column align="center" prop="url" label="链接地址"></el-table-column>
      <el-table-column align="center" prop="creator" label="创建人"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updater" label="更新人"></el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column align="center" label="操作">
        <template v-slot="scope">
          <el-button size="mini" type="text" @click="handleTableCompile(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click="handleTableDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryform.pageNo" :limit.sync="queryform.pageSize"
      @pagination="getList" />
    <add-form ref="addForm" @success="getList" />

  </div>
</template>
<script>
import addForm from './addForm.vue'
import * as circleAPI from '@/api/system/circle'
export default {
  components: { addForm },
  name: 'circle',
  data() {
    return {
      dialogVisible: false,
      tableLoading: false,
      total: 0,
      queryform: {
        pageNo: 1,
        pageSize: 10,
        time:[]
      },
      form: {
      },
      tableData: []
    }
  },
  created() {
    this.getList()
   },
  methods: {
    async getList() {
      try {
        this.tableLoading = true
        const res = await circleAPI.getTablePage({
          startTime: this.queryform.time[0],
          endTime: this.queryform.time[1],
          ...this.queryform
        })
        this.tableData = res.data.list
        this.total = res.data.total
      } finally {
        this.tableLoading = false
      }
    },
    handleQuery() {
      this.getList()

    },
    resetForm() {
      this.queryform = {
        pageNo: 1,
        pageSize: 10,
        time:[]
      }
      this.getList()
    },
    handleTableAdd() {
      this.$refs.addForm.open()
    },
    handleTableCompile(row) {
      this.$refs.addForm.open(row.id)
    },
    async handleTableDelete(row) {
      await this.$modal.confirm('是否确认删除？')
      await circleAPI.deleteTable({id:row.id})
      this.$modal.msgSuccess('删除成功')
      this.getList()
    }
  }
}
</script>
