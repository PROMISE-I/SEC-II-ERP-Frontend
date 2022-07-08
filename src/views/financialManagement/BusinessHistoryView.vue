<template>
  <Layout>
    <Title title="查看经营历程表"></Title>
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
        <el-form-item label="单据类型" prop="sheetType">
          <el-select v-model="conditionForm.sheetType" placeholder="请选择单据类型">
            <el-option
              v-for="item in sheetTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.title">
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
        <el-form-item label="操作员" prop="operator">
          <el-select v-model="conditionForm.operator" placeholder="请选择业务员">
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
        <h4>{{beginDate}}&nbsp;至&nbsp;{{endDate}} 内的 {{curSheetType}} </h4>
        <div class="mt15">
          <span><strong>数量合计为: </strong></span>
          <span>{{sheetCount}}</span>
        </div>
        <div class="mt15">
          <span><strong>具体单据信息：</strong></span>
          <div v-if="conditionForm.sheetType === 'sale'">
            <b-h-sale-list :list="sheetContentList" />
          </div>
          <div v-else-if="conditionForm.sheetType === 'sale-returns'">
            <b-h-sale-return-list :list="sheetContentList" />
          </div>
          <div v-else-if="conditionForm.sheetType === 'purchase'">
            <b-h-purchase-list :list="sheetContentList" />
          </div>
          <div v-else-if="conditionForm.sheetType === 'purchase-returns'">
            <b-h-purchase-return-list :list="sheetContentList" />
          </div>
          <div v-else-if="conditionForm.sheetType === 'receive-money'">
            <b-h-receive-money-list :list="sheetContentList" />
          </div>
          <div v-else-if="conditionForm.sheetType === 'pay-money'">
            <b-h-pay-money-list :list="sheetContentList" />
          </div>
          <div v-else-if="conditionForm.sheetType === 'salary'">
            <b-h-salary-list :list="sheetContentList" />
          </div>
          <div v-else-if="conditionForm.sheetType === 'present'">
            <b-h-present-list :list="sheetContentList" />
          </div>
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
import { showBusinessHistory } from "@/network/financialManagement";
import BHSaleList from "@/views/financialManagement/BH-components/BHSaleList";
import BHSaleReturnList from "@/views/financialManagement/BH-components/BHSaleReturnList";
import BHPurchaseList from "@/views/financialManagement/BH-components/BHPurchaseList";
import BHPurchaseReturnList from "@/views/financialManagement/BH-components/BHPurchaseReturnList";
import BHReceiveMoneyList from "@/views/financialManagement/BH-components/BHReceiveMoneyList";
import BHPayMoneyList from "@/views/financialManagement/BH-components/BHPayMoneyList";
import BHSalaryList from "@/views/financialManagement/BH-components/BHSalaryList";
import BHPresentList from "@/views/financialManagement/BH-components/BHPresentList";
import {getAllStaff} from "@/network/staff";
import {getAllCommodity} from "@/network/commodity";
import {getAllCustomer} from "@/network/sale";

export default {
  name: "BusinessHistoryView",
  components: {
    BHPresentList,
    BHSalaryList,
    BHPayMoneyList,
    BHReceiveMoneyList,
    BHPurchaseReturnList,
    BHPurchaseList,
    BHSaleReturnList,
    BHSaleList,
    Layout,
    Title
  },
  data() {
    return {
      conditionForm: {},
      queryFlag: false,
      sheetCount: 0,
      sheetContentList: [],
      sheetTypeList: [
        { id: 0, title: 'sale',             name: '销售单'},
        { id: 1, title: 'sale-returns',     name: '销售退货单'},
        { id: 2, title: 'purchase',         name: '进货单'},
        { id: 3, title: 'purchase-returns', name: '进货退货单'},
        { id: 4, title: 'receive-money',    name: '收款单'},
        { id: 5, title: 'pay-money',        name: '付款单'},
        { id: 6, title: 'salary',           name: '工资单'},
        { id: 7, title: 'present',          name: '赠送单'},
      ],      // 单据类型
      customerList: [],       // 客户
      operatorList: [],       // 操作员
      rules: {
        date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        sheetType: [
          { required: true, message: '请选择单据类型', trigger: 'change' }
        ],
        customer: [
          { required: true, message: '请选择一个客户', trigger: 'change' }
        ],
        operator: [
          { required: true, message: '请选择一个操作员', trigger: 'change' }
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
    },
    curSheetType: function () {
      return this.conditionForm.sheetType === '' ? '' : this.showSheetTypeName(this.conditionForm.sheetType)
    }
  },
  mounted() {
    getAllStaff({}).then(_res => {
      this.operatorList = []
      for (let staff of _res.result) {
        this.operatorList.push(staff)
      }
    })
    getAllCommodity({}).then(_res => {
      this.commodityList = []
      this.commodityList = _res.result
    })
    getAllCustomer({ params: { type: 'SELLER' } }).then(_res => {
      this.customerList = _res.result
    })
    getAllCustomer({ params: { type: 'SUPPLIER' } }).then(_res => {
      this.customerList = this.customerList.concat(_res.result)
    })
  },
  methods: {
    getData() {
      const config = {
        params: {
          begin: this.beginDate,
          end: this.endDate
        }
      }
      console.log(config)
      this.sheetContentList = []
      let hasData = false
      showBusinessHistory(config).then(_res => {
        let allSheets = _res.result
        allSheets.forEach(sheet => {
          if (this.conditionForm.sheetType === sheet.type) {
            this.sheetContentList.push(sheet.sheetObject)
            hasData = true
          }
        })
        this.sheetCount = this.sheetContentList.length
      })
      console.log(this.sheetContentList)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getData()
          this.queryFlag = true
        }
      })
    },
    showSheetTypeName(type) {
      for (let item of this.sheetTypeList) {
        if (item.title === type) {
          return item.name
        }
      }
      console.log('Type Error in showSheetTypeName()!')
    }
  }
}
</script>

<style scoped>

</style>