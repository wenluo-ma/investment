<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-tree :data="treeData" :props="treeProps"></el-tree>
      </el-col>
      <el-col :span="20">
        <el-row class="title-container">
          <h2 class="title">热搜快词配置</h2>
          <el-link type="primary" @click="openForm(undefined)">编辑</el-link>
          <WordConfig ref="config" @success="getConfig" />
        </el-row>
        <el-row>
          <div class="config-detail">排序依据:点击量</div>
          <div class="config-detail">更新频率:每{{ this.configParams.updateFrequency }}小时</div>
          <div class="config-detail">统计范围:最近{{ this.configParams.statisticPeriod }}天</div>
        </el-row>
        <el-row>

          <el-table v-loading="loading" :data="tableData">
            <!-- <el-table-column align="center" prop="id" label="序号" /> -->
            <el-table-column align="center" prop="keyword" label="快搜热词" />
            <!-- <el-table-column align="center" prop="wordId" label="词ID" /> -->
            <!-- <el-table-column align="center" prop="rankId" label="排序ID" /> -->

            <el-table-column align="center" prop="deleted" label="是否删除" />
            <el-table-column align="center" prop="clicks" label="点击量" />
            <el-table-column align="center" prop="creator" label="创建人" />
            <el-table-column align="center" prop="createTime" label="创建时间" />
            <el-table-column align="center" prop="isTop" label="是否置顶">
              <template v-slot="scope">
                <span v-if="scope.row.isTop === 0">是</span>
                <span v-else-if="scope.row.isTop === 1">否</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template v-slot="scope">
                <el-button v-if="scope.row.isTop === 0" size="mini" type="text"
                  @click="handleCancelTop(scope.row)">取消置顶</el-button>
                <el-button v-else-if="scope.row.isTop === 1" size="mini" type="text"
                  @click="handleTop(scope.row)">置顶</el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <pagination v-show="total > 0" :total="total" :page.sync="configParams.pageNo"
          :limit.sync="configParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import WordConfig from './WordConfig.vue';
import * as HotApi from '@/api/system/hot'
export default {
  name: 'hotWord',
  components: {
    WordConfig,
  },
  data() {
    return {
      loading: false,
      total: 10,
      treeData: [
        {
          label: '法律法规',
        },
        {
          label: '治理制度',
        },
        {
          label: '权威解读',
        },
        {
          label: '信披公告',
        },
      ],
      treeProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [],
      //配置数据
      configParams: {
        sortOrder: 'DESC',
        updateFrequency: 1,
        statisticPeriod: 30,
        pageNo: 1,
        pageSize: 10,
      }

    };
  },
  created() {
    this.getList();
  },
  // watch: {
  //   'configParams': {
  //     handler(newVal, oldVal) {
  //       console.log(newVal, oldVal);
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const res = await HotApi.getHotPage(this.configParams);
        this.tableData = res.data.list;

        this.total = res.data.total;
      }
      finally {
        this.loading = false;
      }
    },

    openForm() {
      this.$refs.config.open();
    },
    async handleDelete(row) {
      const id = row.id;
      console.log(id);
      await this.$modal.confirm('是否确认删除"' + row.keyword + '"数据项?')
      try {
        await HotApi.deleteWord({ id: id });
        await this.getList();
        this.$modal.msgSuccess("删除成功");
      } catch {

      }
    },
    async getConfig(params) {

      this.configParams.statisticPeriod = params.range;
      this.configParams.sortOrder = params.sort;
      this.configParams.updateFrequency = params.updata

      console.log(this.configParams);

      await this.getList();
    },
    async handleTop(row) {
      console.log(row);

      try {
        let top = row.isTop;
        let id = row.id;
        top = parseInt(top);
        id = parseInt(id);
        console.log('置顶', id, top);
        await HotApi.top({
          id: id,
          isTop: 0
        });
        this.$modal.msgSuccess("置顶成功");
        await this.getList();
      } catch { }
    },
    async handleCancelTop(row) {
      try {
        const top = row.isTop;
        const id = row.id;
        console.log('取消置顶', id, top);
        await HotApi.top({
          id: id,
          isTop: 1
        });
        this.$modal.msgSuccess("取消置顶成功");
        await this.getList();
      } catch (e) {
        console.log(e);
      }
    },
  },

};
</script>
<style>
.title {
  margin: 10px;
  font-size: 20px;
  font-weight: bold;
  display: inline-block;
}

.title-container {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center
}

.config-detail {
  display: inline-block;
  margin: 10px;
  margin-right: 20px;
}
</style>
