<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column align="center" prop="id" label="序号"></el-table-column>
      <el-table-column align="center" prop="exchange" label="交易所"></el-table-column>
      <el-table-column align="center" prop="url" label="休市安排URL"></el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column align="center" prop="updater" label="更新人"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryform.pageNo" :limit.sync="queryform.pageSize"
      @pagination="getList" />
    <editForm ref="editDialog" @success="getList"></editForm>
  </div>
</template>
<script>
import editForm from './editForm.vue'
import * as arrangementApi from '@/api/system/arrangement'
export default {
  components: {
    editForm
  },
  data() {
    return {
      total: 0,
      queryform: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: [
        {
          id: 1,
          exchange: '上海证券交易所',
          arrangement: 'http://www.sse.com.cn/disclosure/exchangeannouncement/listedinfo/announcement/',
          updateTime: '2020-01-01 10:00:00',
          updater: '张三'
        }
      ],
      loading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const res = await arrangementApi.getTablePage(this.queryform);
        this.tableData = res.data.list;
        this.total = res.data.total;
      } finally {
        this.loading = false;
      }
    },

    edit(row) {
      const id = row.id;
      this.$refs.editDialog.open(id);
    }
  },

}


</script>
