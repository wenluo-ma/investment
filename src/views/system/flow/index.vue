<template>
  <div class="app-container">
    <el-form :inline="true" v-model="queryform">
      <el-form-item prop="处理">
        <el-radio-group v-model="queryform.status">
          <el-radio-button label="待处理"></el-radio-button>
          <el-radio-button label="已处理"></el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="标题">
        <el-input placeholder="请输入内容" v-model="queryform.title" icon="el-icon-search" clearable
          @keyup.enter.native="handleQuery">
          <template slot="prepend">标题</template>
        </el-input icon="el-icon-search">
      </el-form-item>

      <el-form-item prop="业务分类">
        <el-select v-model="queryform.businessCategory" placeholder="业务分类">
          <el-option v-for="item in businessCategoryOptions" :key="item" :label="item" :value="item">
          </el-option>

        </el-select>
      </el-form-item>
      <el-form-item prop="适用板块">
        <el-select v-model="queryform.applicableSection" placeholder="适用板块">
          <el-option v-for="item in applicableSectionOptions" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="发起人">
        <el-select v-model="queryform.creator" placeholder="发起人">
          <el-option v-for="item in creatorOptions" :key="item" :label="item" :value="item">
          </el-option>


        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="time" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" align="right" unlink-panels
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe style="width: 100%" @row-click="handleRowClick" v-loading="loading">
      <!-- <el-table-column align="center" prop="id" label="ID" width="100"></el-table-column>
      <el-table-column align="center" prop="description" label="意见" width="100"></el-table-column> -->
      <el-table-column align="center" prop="title" label="标题"></el-table-column>
      <el-table-column align="center" prop="businessCategory" label="业务分类" width="100"></el-table-column>
      <el-table-column align="center" prop="count" label="节点个数" width="100"></el-table-column>
      <el-table-column align="center" prop="applicableSection" label="适用板块" width="120"></el-table-column>
      <el-table-column align="center" prop="status" label="审批状态" width="100"></el-table-column>
      <el-table-column align="center" prop="creator" label="发起人" width="100"></el-table-column>
      <el-table-column align="center" prop="startTime" label="发起时间" width="100"></el-table-column>
      <el-table-column align="center" prop="endTime" label="结束时间" width="100"></el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="mini">审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryform.pageNo" :limit.sync="queryform.pageSize"
      @pagination="getList" />
    <el-drawer :title="nowStatus.title" :visible.sync="drawer" :with-header="false" size="50%">
      <div class="drawer">
        <div class="detail header">
          <h1>{{ nowStatus.title }}</h1>
          <h1>{{ nowStatus.status }}</h1>
          <el-button-group>
            <el-button icon="el-icon-arrow-left" :disabled="this.nowStatus.index === 0" @click="toLeft(nowStatus.index)"></el-button>
            <el-button :disabled="this.nowStatus.index === this.tableData.length - 1" @click="toRight(nowStatus.index)"><i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </el-button-group>
        </div>

        <div class="detail">
          <div class="step">
            <el-steps v-show="nowStatus.status === '待处理'" align-center :space="300" :active="1" finish-status="success">
              <el-step title="提交"></el-step>
              <el-step title="待处理"></el-step>
            </el-steps>
            <el-steps v-show="nowStatus.status === '已通过'" align-center :space="300" :active="2" finish-status="success">
              <el-step title="提交"></el-step>
              <el-step title="已通过"></el-step>
            </el-steps>
            <el-steps v-show="nowStatus.status === '已驳回'" align-center :space="300" :active="2" finish-status="error">
              <el-step title="提交"></el-step>
              <el-step title="已驳回"></el-step>
            </el-steps>
          </div>
          <el-button type="primary" @click="openForm(nowStatus.id)"
            :disabled="nowStatus.status === '已驳回' || nowStatus.status === '已通过'">审批</el-button>
        </div>
        <h2>{{ nowStatus.creator }}提交于{{ nowStatus.startTime }}</h2>
        <div class="detail">

          <h2 style="display: inline-block;" v-show="nowStatus.description">审批意见：{{ nowStatus.description }}</h2>
          <el-button type="primary" v-show="nowStatus.description" @click="repeal">撤销</el-button>
        </div>

      </div>
    </el-drawer>
    <StatusForm ref="formRef" @success="getList" />
  </div>

</template>

<script>
import StatusForm from './StatusForm.vue';
import * as flowApi from "@/api/system/flow";
export default {
  components: {
    StatusForm,
  },
  name: "Flow",
  data() {
    return {
      // 时间
      time: [],
      // 总条数
      total: 0,
      // 遮罩层
      loading: false,
      // 业务分类选项
      businessCategoryOptions: ['A', 'B', 'C'],
      //适用板块选项
      applicableSectionOptions: ["上交所主板", "上交所科创板", "深交所主板", "深交所创业板"],
      // 发起人选项
      creatorOptions: ["伊稳山", "孙夫雄", "张承德"],
      // 抽屉
      drawer: false,
      // 表格的列
      columns: null,
      //可提交的查询数据
      queryform: {
        status: "待处理",
        title: null,
        businessCategory: null,
        applicableSection: null,
        creator: null,
        startTime: null,
        endTime: null,
        pageNo: 1,
        pageSize: 10,
      },
      //点击详情后进行审批的表格数据
      nowStatus: {
        title: "",
        businessCategory: "",
        count: "",
        applicableSection: "",
        status: "",
        creator: "",
        startTime: "",
        endTime: "",
        //第几行
        index: "",
        id: "",
        description: "",
      },
      // 表格数据
      tableData: [
        {
          id: 1,
          title: "关于伊稳山同志升任信息工程学院院长的职务的申请",
          businessCategory: "A",
          count: 5,
          applicableSection: "上交所主板",
          status: "待处理",
          creator: "伊稳山",
          startTime: "2022-01-01",
          endTime: "2022-01-31",
        },
        {
          id: 2,
          title: "关于孙夫雄同志升任信息工程学院副院长的职务的申请",
          businessCategory: "B",
          count: 3,
          applicableSection: "上交所科创板",
          status: "已驳回",
          creator: "孙夫雄",
          startTime: "2022-02-01",
          endTime: "2022-02-28",
        },
        {
          id: 3,
          title: "关于张承德同志升任信息工程学院第三院长的职务的申请",
          businessCategory: "C",
          count: 7,
          applicableSection: "深交所主板",
          status: "已通过",
          creator: "张承德",
          startTime: "2022-03-01",
          endTime: "2022-03-31",
        },
      ],
    };
  },
  created() {
    this.getList();

  },
  watch: {
    'queryform.status'(newVal, oldVal) {
      this.getList();
    }
  },

  methods: {
    handleRowClick(row) {
      this.drawer = true;
      this.nowStatus = row;
      const index = this.tableData.indexOf(row);
      this.nowStatus.index = index;
    },

    toLeft(index) {
      if (index > 0) {
        console.log('上一个', index);
        this.nowStatus = this.tableData[index - 1];
        this.nowStatus.index = index - 1

      } else {
        //弹出提示
        this.$message('已经是第一个了')

      }
    },
    toRight(index) {
      if (index < this.tableData.length - 1) {
        // console.log('下一个',index);
        this.nowStatus = this.tableData[index + 1];
        this.nowStatus.index = index + 1
      } else {
        //弹出提示
        // this.$message('已经是最后一个了')
      }
    },
    openForm(id) {
      this.drawer = false

      this.$refs["formRef"].open(id)

    },
    handleQuery() {
      this.getList();
    },
    async getList() {
      try {
        this.queryform.startTime = this.time[0];
        this.queryform.endTime = this.time[1];
        this.loading = true;
        const res = await flowApi.getTablePage(this.queryform);
        this.tableData = res.data.list;
        this.total = res.data.total;


      } finally {
        this.loading = false;
      }
    },
    reset() {

        this.queryform.title = null,
        this.queryform.businessCategory = null,
        this.queryform.applicableSection = null,
        this.queryform.creator = null,
        this.queryform.startTime = null,
        this.queryform.endTime = null,

        this.time = [];
      this.getList();
    },
    async repeal() {
      await this.$modal.confirm('是否确认撤销？')
      try {
        await flowApi.repeal({ id: this.nowStatus.id });
      } finally {
        this.getList();
      }
    }
  },
};
</script>

<style scoped>
el-form {
  text-align: center;
}

.detail {
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  padding: 10px;
}

.drawer {
  padding: 20px;
}

.step {
  width: 70%;
}
</style>
