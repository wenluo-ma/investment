<template>
  <el-row :gutter="20">

    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>投研活动</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="openCardForm()"><i
              class="el-icon-plus"></i></el-button>
        </div>
        <div class="text input">
          <el-input v-model="queryCard.activityName" placeholder="请输入内容" clearable
            @keyup.enter.native="getCardList()"></el-input>
        </div>
        <div v-for="(item, index) in cardList" :key="item.id" class="text item" ref="card" v-loading="cardLoading"
          @click="handleCardClick(index, item.id)">
          <div class="item-title">
            <h1>{{ item.activityName }}</h1>
            <el-popover placement="right" width="100" trigger="hover" content="">
              <el-button @click="handleCardActive(item)">编辑</el-button><br>
              <el-button @click="handleCardDelete(item.id)">删除</el-button>
              <el-button slot="reference"><i class="el-icon-more"></i></el-button>
            </el-popover>

          </div>
          <span>{{ item.organizer }}</span>
          <span>{{ item.activityTime }}</span>
        </div>
      </el-card>
      <!-- <pagination small v-show="cardTotal > 0" :total="cardTotal" :page.sync="queryCard.pageNo"
        :limit.sync="queryCard.pageSize" @pagination="getCardList" /> -->
      <pagination small v-show="cardTotal > 0" :total="cardTotal" :page.sync="queryCard.pageNo"
        :limit.sync="queryCard.pageSize" @pagination="getCardList" layout="prev, pager, next" />
    </el-col>
    <el-col :span="18">
      <el-button class="header-button" type="primary" @click="openTableForm(null, queryTable.activityId)"
        :disabled="activityId == null">添加会议</el-button>
      <el-table :data="tableData" stripe style="width: 100%" v-loading="tableLoading">
        <el-table-column align="center" prop="meetingName" label="会议名称"></el-table-column>
        <el-table-column align="center" prop="researchCompany" label="调研公司" width="150"></el-table-column>
        <el-table-column align="center" prop="meetingTime" label="会议时间" width="150"></el-table-column>
        <el-table-column align="center" prop="meetingAddress" label="会议地址" width="150"></el-table-column>
        <el-table-column align="center" prop="researcher" label="研究员" width="100"></el-table-column>
        <el-table-column align="center" prop="researchTarget" label="调研对象" width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template v-slot="scope">
            <el-button size="mini" type="text" @click="handleTableCompile(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleTableDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableTotal > 0" :total="tableTotal" :page.sync="queryTable.pageNo"
        :limit.sync="queryTable.pageSize" @pagination="getTableList" />
    </el-col>
    <cardForm ref="cardFormRef" @success="getCardList" />
    <tableForm ref="tableFormRef" @success="getTableList" />
  </el-row>
</template>
<script>
import cardForm from './cardForm.vue';
import tableForm from './tableForm.vue';
import * as researchAPI from '@/api/system/research'
export default {
  name: "research",
  components: {
    cardForm,
    tableForm
  },
  data() {
    return {
      cardLoading: false,
      tableLoading: false,
      activityId: null,
      tableTotal: 10,
      cardTotal: 10,
      cardList: [],
      queryTable: {
        activityId: 1,
        pageSize: 10,
        pageNo: 1
      },
      queryCard: {
        activityName: null,
        pageSize: 7,
        pageNo: 1
      },
      tableData: []
    }
  },
  created() {
    this.getCardList();
  },
  methods: {
    handleCardClick(index, id) {

      this.activityId = id;
      //给其他卡片移除新类
      console.log('card', this.$refs.card);
      console.log('长度', this.$refs.card.length);


      for (let i = 0; i < this.$refs.card.length; i++) {

        this.$refs.card[i].classList.remove('active')

      }
      // 点击卡片时，为他添加新类
      this.$refs.card[index].classList.add('active')
      // 点击卡片时，获取表格数据
      this.getTableList()
    },
    handleCardActive(item) {
      this.openCardForm(item)
    },
    async handleCardDelete(id) {

      await this.$modal.confirm('是否确认删除?')
      try {
        console.log('删除');

        await researchAPI.deleteCard({ id })
        this.$message.success('删除成功')

      } catch {

      } finally {
        this.getCardList()
      }

    },
    openCardForm(item) {
      this.$refs["cardFormRef"].open(item);
    },
    openTableForm(row, activityId) {
      this.$refs["tableFormRef"].open(row, activityId);
    },
    handleTableCompile(row) {
      this.openTableForm(row)
    },
    async handleTableDelete(row) {
      await this.$modal.confirm('是否确认删除?')
      try {
        console.log('删除');

        await researchAPI.deleteTable({ id: row.id })
        this.$message.success('删除成功')
        this.getTableList()
      } catch { }
    },
    async getTableList() {
      try {
        this.queryTable.activityId = this.activityId;
        this.tableLoading = true;
        const res = await researchAPI.getTablePage(this.queryTable)
        this.tableData = res.data.list;
        this.tableTotal = res.data.total;
      } finally {
        this.tableLoading = false;
      }
    },
    async getCardList() {

      try {
        this.cardLoading = true;
        const res = await researchAPI.getCardPage(this.queryCard)
        this.cardList = res.data.list;
        this.cardTotal = res.data.total;

        // this.getTableList()
      } finally {
        this.cardLoading = false;

      }
    }
  }
}
</script>
<style>
.text {
  font-size: 14px;

}

.input {
  margin-bottom: 18px;
}

.item {
  padding: 5px;
  transition: all 0.3s;
  cursor: pointer;
}

.header-button {
  margin: 20px 10px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  height: calc(100vh - 150px);
}

.active {
  background-color: rgb(218, 241, 255);
  color: rgb(93, 201, 255)
}

.item-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
