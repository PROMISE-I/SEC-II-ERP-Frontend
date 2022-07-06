<template>
  <Layout>
    <Title title="查看销售明细表"></Title>
    <div>
      <span><strong>请选择一个时间段: </strong></span>
      <el-date-picker
          v-model="date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getData()">
      </el-date-picker>
      <div v-if="date !== ''" class="mt15">
        <h4>{{beginDate}}&nbsp;至&nbsp;{{endDate}} 内的</h4>
        <div class="mt15">
          <span><strong>销售记录数量合计为: </strong></span>
          <span>{{saleQuantity}}</span>
        </div>
        <div class="mt15">
          <span><strong>销售退货数量合计为: </strong></span>
          <span>{{saleReturnQuantity}}</span>
        </div>
        <div class="mt15">
          <span><strong>出/入库商品信息</strong></span>
          <el-table
              :data="sheetContent"
              stripe
              style="width: 100%"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}"
              class="mt15">
            <el-table-column
                prop="type"
                label="类型"
                width="100"
                :filters="[{ text: '销售', value: '销售' }, { text: '销售退货', value: '销售退货' }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                    :type="scope.row.type === '销售' ? 'primary' : 'success'"
                    disable-transitions>{{scope.row.type}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                prop="productName"
                label="产品名称"
                width="200">
            </el-table-column>
            <el-table-column
                prop="productType"
                label="产品类型"
                width="200">
            </el-table-column>
            <el-table-column
                prop="quantity"
                label="数量"
                width="150">
            </el-table-column>
            <el-table-column
                prop="unitPrice"
                label="产品单价(元)"
                width="150">
            </el-table-column>
            <el-table-column
                prop="totalAmount"
                label="总价(元)"
                width="150">
            </el-table-column>
            <el-table-column
                label="时间">
              <template slot-scope="scope">
                {{formatDate(scope.row.createTime)}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </Layout>
</template>
<!-- TODO -->
<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import { formatDate } from "@/common/utils";
import {
  getSaleDetailByRange,
  getSaleReturnDetailByRange,
  findSaleDetailByCondition,
  findSaleReturnDetailByCondition
} from "@/network/financialManagement";

export default {
  name: "SaleDetailView",
  components: {
    Layout,
    Title
  },
  data() {
    return {
      date: '',
      saleQuantity: 0,
      saleReturnQuantity: 0,
      sheetContent: [],
      commodityList: [],
      customerList: [],
      operatorList: []
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
    getData() {
      const config = {
        params: {
          beginTimeStr: this.beginDate,
          endTimeStr: this.endDate
        }
      }
      this.sheetContent = []
      let hasData = false
      getSaleDetailByRange(config).then(_res => {
        this.saleQuantity = _res.result.length
        for (let item of _res.result) {
          let sheet = item
          sheet.type = '销售'
          this.sheetContent.push(sheet)
        }
        if (this.saleQuantity === 0) {
          this.$message.info('该时间段内查无销售记录')
        } else {
          hasData = true
        }
      })
      getSaleReturnDetailByRange(config).then(_res => {
        this.saleReturnQuantity = _res.result.length
        for (let item of _res.result) {
          let sheet = item
          sheet.type = '销售退货'
          this.sheetContent.push(sheet)
        }
        if (this.saleReturnQuantity === 0) {
          this.$message.info('该时间段内查无销售退货记录')
        } else {
          hasData = true
        }
      })
      if (hasData === true) {
        this.$message.success('查询成功！')
      }
    },
    filterTag(value, row) {
      return row.type === value
    },
    formatDate
  }
}
</script>

<style scoped>

</style>