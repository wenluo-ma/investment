<template>
  <div class="app-container">

    <el-form :model="query" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item prop="company">
        <el-input v-model="query.company" placeholder="请输入公司名称" @keyup.enter.native="handleQuery()" />
      </el-form-item>
      <el-form-item prop="industry">
        <el-input v-model="query.industry" placeholder="请输入行业" @keyup.enter.native="handleQuery()" />
      </el-form-item>
      <el-form-item prop="time">
        <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button icon="el-icon-download" @click="handleImport">导入</el-button>
      <el-button icon="el-icon-upload2" @click="handleExmport" :v-loading="exportLoading">导出</el-button>

    </el-row>
    <el-table :data="tableList" stripe style="width: 100%" v-loading="tableLoading">
      <el-table-column align="center" prop="id" label="序号"></el-table-column>
      <el-table-column align="center" prop="meetingTime" label="时间"></el-table-column>
      <el-table-column align="center" prop="company" label="调研公司"></el-table-column>
      <el-table-column align="center" prop="industry" label="所属行业"></el-table-column>
      <el-table-column align="center" prop="telephone" label="电话参会"></el-table-column>
      <el-table-column align="center" prop="password" label="参会密码"></el-table-column>
      <el-table-column align="center" prop="isDated" label="是否过期"></el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template v-slot="scope">
          <el-button size="mini" type="text" @click="handleTableCompile(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click="handleTableDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize"
      @pagination="getList" />
    <tableForm ref="tableForm" @success="getList" />
    <importForm ref="importForm" />
  </div>
</template>
<script>
import tableForm from './tableForm.vue';
import importForm from './importForm.vue';
import * as telephoneAPI from '@/api/system/telephone'
export default {
  name: 'telephone',
  components: {
    tableForm,
    importForm
  },
  data() {
    return {
      total: 0,
      tableLoading: false,
      time: null,
      exportLoading: false,
      
      query: {
        company: null,
        industry: null,
        pageNo: 1,
        pageSize: 10,
        startTime: null,
        endTime: null
      },
      tableList: [
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      if (this.time) {
        this.query.startTime = this.time[0]
        this.query.endTime = this.time[1]
      }
      this.tableLoading = true
      try {
        const res = await telephoneAPI.getTableList(this.query)
        this.tableList = res.data.list
        //对tableList的是否过期进行处理
        this.tableList.forEach(item => {
          if (item.isDated === true) {
            item.isDated = '是'
          } else {
            item.isDated = '否'
          }
        })
        this.total = res.data.total
      } catch (error) {
        console.log(error)
      } finally {
        this.tableLoading = false
      }
    },
    handleQuery() {
      this.query.pageNo = 1
      this.query.pageSize = 10
      this.getList()
    },
    resetQuery() {

      this.$refs.queryForm.resetFields()
      this.time = null
      this.query={
        company: null,
        industry: null,
        pageNo: 1,
        pageSize: 10,
        startTime: null,
        endTime: null
      }
      this.getList()
    },
    handleAdd() {
      this.$refs.tableForm.open()
    },
    async handleExmport() {
      await this.$modal.confirm('是否确认导出所有电话会议数据项?');
      try {
        this.exportLoading = true;
        const data = await telephoneAPI.exportMeetingExcel(this.query);
        this.$download.excel(data, '电话会议.xls');
      } catch {
      } finally {
        this.exportLoading = false;
      }
    },
    handleImport() {
      this.$refs.importForm.open()
    },
    handleTableCompile(row) {
      this.$refs.tableForm.open(row)
    },
    async handleTableDelete(row) {
      //确认删除
      try {
        await this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        //调用删除接口
        await telephoneAPI.deleteTable({id:row.id})
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getList()
      } catch (error) {
        console.log(error)
      }

    }
  }
}

</script>
