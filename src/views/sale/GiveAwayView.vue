<template>
  <Layout>
    <Title title="赠送单管理"></Title>
    <div class="body">
      <el-tabs v-model="activeName" :stretch="true">
        <el-tab-pane label="待一级审批" name="PENDING_LEVEL_1">
          <div v-if="pendingLevel1List.length === 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div v-else>
            <give-away-list :list="pendingLevel1List" :type="1" @refresh="getData()"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待二级审批" name="PENDING_LEVEL_2">
          <div v-if="pendingLevel2List.length === 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div v-else>
            <give-away-list :list="pendingLevel2List" :type="2" @refresh="getData()"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审批完成" name="SUCCESS">
          <div v-if="successList.length === 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div v-else>
            <give-away-list :list="successList" :type="3"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审批失败" name="FAILURE">
          <div v-if="failureList.length === 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div v-else>
            <give-away-list :list="failureList" :type="4"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="等待销售单" name="PENDING_SALE_SHEET_APPROVAL_SUCCESS">
          <div v-if="pendingSaleList.length === 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div v-else>
            <give-away-list :list="pendingSaleList" :type="5"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import GiveAwayList from "@/views/sale/components/GiveAwayList";
import { getAllGiveAway } from "@/network/sale";
export default {
  name: "GiveAwayView",
  components: {
    Layout,
    Title,
    GiveAwayList
  },
  data() {
    return {
      activeName: 'PENDING_LEVEL_1',
      giveAwayList: [],
      pendingLevel1List: [],
      pendingLevel2List: [],
      successList: [],
      failureList: [],
      pendingSaleList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getAllGiveAway({}).then(_res => {
        let allSheets = _res.result
        this.giveAwayList = allSheets
        this.pendingLevel1List = allSheets.filter(item => item.state === '待一级审批')
        this.pendingLevel2List = allSheets.filter(item => item.state === '待二级审批')
        this.successList = allSheets.filter(item => item.state === '审批完成')
        this.failureList = allSheets.filter(item => item.state === '审批失败')
        this.pendingSaleList = allSheets.filter(item => item.state === '等待销售单通过审批')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.body {
  margin: 0 auto;
  margin-top: 10px;
  height: 80vh;
  overflow-y: auto;
  width: 100%;
  background: rgba($color: #fff, $alpha: 0.5);
}
</style>