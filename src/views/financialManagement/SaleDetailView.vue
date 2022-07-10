<template>
  <Layout>
    <Title title="查看销售明细表"></Title>
    <div>
      <el-form ref="conditionForm" :model="conditionForm" label-width="80px" :rules="rules">
        <el-form-item label="时间段" prop="date">
          <el-date-picker
              v-model="conditionForm.date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品名" prop="productName">
          <el-select v-model="conditionForm.productName" placeholder="请选择商品名">
            <el-option
              v-for="item in commodityList"
              :key="item.id"
              :value="item.name"
              :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户" prop="customer">
          <el-select v-model="conditionForm.customer" placeholder="请选择客户">
            <el-option
                v-for="item in customerList"
                :key="item.id"
                :value="item.id"
                :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作员" prop="salesman">
          <el-select v-model="conditionForm.salesman" placeholder="请选择业务员">
            <el-option
                v-for="item in operatorList"
                :key="item.id"
                :value="item.name"
                :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('conditionForm')">立即查询</el-button>
        </el-form-item>
      </el-form>
      <div v-if="queryFlag === true" class="mt15">
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
              class="mt15"
              id="out-table"
          >
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
        <el-button @click="exportAsExcel('out-table', 'sale-detail' + Date.now() + '.xlsx')">导出Excel</el-button>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import { formatDate } from "@/common/utils";
import { getAllCommodity} from "@/network/commodity";
import { getAllCustomer } from "@/network/sale";
import { getAllStaff } from "@/network/staff";
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
      queryFlag: false,
      saleQuantity: 0,
      saleReturnQuantity: 0,
      sheetContent: [],
      commodityList: [],
      customerList: [],
      operatorList: [],
      conditionForm: {},
      rules: {
        date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '请选择产品名称', trigger: 'change' }
        ],
        customer: [
          { required: true, message: '请选择客户', trigger: 'change' }
        ],
        salesman: [
          { required: true, message: '请选择操作员', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    beginDate: function () {
      return this.conditionForm.date === '' ? '' : formatDate(this.conditionForm.date[0])
    },
    endDate: function () {
      return this.conditionForm.date === '' ? '' : formatDate(this.conditionForm.date[1])
    }
  },
  mounted() {
    // 初始化选择的列表
    getAllStaff({}).then(_res => {
      this.operatorList = []
      for (let staff of _res.result) {
        if (staff.position === 'SALE_STAFF' || staff.position === 'SALE_MANAGER') {
          this.operatorList.push(staff)
        }
      }
    })
    getAllCommodity({}).then(_res => {
      this.commodityList = []
      this.commodityList = _res.result
    })
    getAllCustomer({ params: { type: 'SELLER' } }).then(_res => {
      this.customerList = _res.result
    })
  },
  methods: {
    getData() {
      const condition = {
        beginDateStr: this.beginDate,
        endDateStr: this.endDate,
        productName: this.conditionForm.productName,
        customer: parseInt(this.conditionForm.customer),
        salesman: this.conditionForm.salesman
      }

      console.log(condition)

      this.sheetContent = []
      let hasData = false
      findSaleDetailByCondition(condition).then(_res => {
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
      findSaleReturnDetailByCondition(condition).then(_res => {
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // czh：这段代码写的太烂了
          this.getData()
          this.queryFlag = true
        }
      })
    },
    filterTag(value, row) {
      return row.type === value
    },
    exportAsExcel(id, title) {
      let fix = document.querySelector('.el-table__fixed');
      let wb;
      if (fix) {
        wb = this.$XLSX.utils.table_to_book(document.getElementById(id).removeChild(fix));
        document.getElementById(id).appendChild(fix);
      } else {
        wb = this.$XLSX.utils.table_to_book(document.getElementById(id));
      }
      /* get binary string as output */
      let wbout = this.$XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      });
      try {
        this.$FileSaver.saveAs(
            new Blob([wbout], {
              type: 'application/octet-stream'
            }),
            title
        );
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout);
      }
      return wbout;
    },
    formatDate
  }
}
</script>

<style scoped>

</style>