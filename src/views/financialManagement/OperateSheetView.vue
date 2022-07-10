<template>
  <Layout>
    <Title title="查看经营情况表"></Title>
    <div>
      <span><strong>请选择一个时间段: </strong></span>
      <el-date-picker
          v-model="date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getOperateSheet()">
      </el-date-picker>
      <div v-if="date !== ''" class="mt15">
        <h4>{{beginDate}}&nbsp;至&nbsp;{{endDate}} 内的</h4>
        <div class="mt15">
          <span><strong> 折让后总收入合计为: </strong></span>
          <span>{{finalIncome}} 元</span>
        </div>
        <div class="mt15">
          <span><strong> 折让总额合计为: </strong></span>
          <span>{{discountedAmount}} 元</span>
        </div>
        <div class="mt15">
          <span><strong> 总支出合计为: </strong></span>
          <span>{{cost}} 元</span>
        </div>
        <div class="mt15">
          <span><strong> 利润合计为: </strong></span>
          <span>{{profit}} 元</span>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import { formatDate } from "@/common/utils";
import { showOperateSheet } from "@/network/financialManagement";

export default {
  name: "OperateSheetView",
  components: {
    Layout,
    Title
  },
  data() {
    return {
      date: '',
      finalIncome: '',      // 折让后总额
      discountedAmount: '',   // 折让金额
      cost: '',             // 总支出
      profit: ''            // 利润
    }
  },
  computed: {
    beginDate: function () {
      return this.date === '' ? '' : formatDate(this.date[0])
    },
    endDate: function () {
      return this.date === '' ? '' : formatDate(this.date[1])
    }
  },
  methods: {
    getOperateSheet() {
      const config = {
        params: {
          begin: this.beginDate,
          end: this.endDate
        }
      }
      showOperateSheet(config).then(_res => {
        let res = _res.result
        this.finalIncome = res.finalIncome
        this.discountedAmount = res.discountedAmount
        this.cost = res.cost
        this.profit = res.profit
      })
    },
    filterTag(value, row) {
      return row.type() === value
    },
    formatDate
  }
}
</script>

<style lang="scss" scoped>
.mt15 {
  margin-top: 15px;
}
</style>