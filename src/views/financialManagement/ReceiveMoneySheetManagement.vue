<template>
  <Layout>
    <Title title="收款单管理"></Title>
    <el-button type="primary" size="medium" @click="dialogVisible = true">制定收款单</el-button>
    <div class="body">
      <el-tabs v-model="activeName" :stretch="true">
        <el-tab-pane label="待一级审批" name="PENDING_LEVEL_1">
          <div v-if="pendingLevel1List.length === 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div v-else>
            <receive-money-list :list="pendingLevel1List" :type="1" @refresh="getReceiveMoney()"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待二级审批" name="PENDING_LEVEL_2">
          <div v-if="pendingLevel2List.length === 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div v-else>
            <receive-money-list :list="pendingLevel2List" :type="2" @refresh="getReceiveMoney()"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审批完成" name="SUCCESS">
          <div v-if="successList.length === 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div v-else>
            <receive-money-list :list="successList" :type="3"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审批失败" name="FAILURE">
          <div v-if="failureList.length === 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div v-else>
            <receive-money-list :list="failureList" :type="4"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
        title="创建收款单"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="receiveMoneyForm" label-width="100px" ref="receiveMoneyForm" :rules="rules">
          <el-form-item label="客户: " prop="customer">
            <el-select v-model="receiveMoneyForm.customer" placeholder="请选择客户">
              <el-option
                  v-for="item in customers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
              v-for="(item, index) in receiveMoneyForm.transferList"
              :key="index"
              :label="'转账' + (index + 1)">
            <div>
              <el-select v-model="item.bankAccountId" placeholder="请选择银行账户" style="width: 40%; margin-right: 5%">
                <el-option
                    v-for="item1 in bankAccountList"
                    :key="item1.id"
                    :label="item1.name"
                    :value="item1.id">
                </el-option>
              </el-select>
              <el-input v-model="item.amount" style="width: 30%; margin-right: 5%" placeholder="请输入转账金额"></el-input>
            </div>
            <div style="margin-top: 10px">
              <el-input v-model="item.remark" style="width: 75%; margin-right: 10%" placeholder="请填写备注"></el-input>
              <el-button type="text" size="small" @click="addBankAccount" v-if="index === receiveMoneyForm.transferList.length - 1">添加</el-button>
              <el-button type="text" size="small" @click.prevent="removeBankAccount(item)" v-if="index !== 0">删除</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('receiveMoneyForm')">立即创建</el-button>
      </span>
    </el-dialog>
  </Layout>
</template>

<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import ReceiveMoneyList from "@/views/financialManagement/components/ReceiveMoneyList";
import {
    getAllReceiveMoney,
    createReceiveMoney
} from "@/network/financialManagement";
import { getAllCustomer } from "@/network/purchase";
import { getAllBankAccount } from "@/network/accountManagement";

export default {
  name: "ReceiveMoneySheetManagement",
  components: {
    Layout,
    Title,
    ReceiveMoneyList
  },
  data() {
    return {
      activeName: 'PENDING_LEVEL_1',
      receiveMoneyList: [],
      pendingLevel1List: [],
      pendingLevel2List: [],
      successList: [],
      failureList: [],
      dialogVisible: false,
      receiveMoneyForm: {
        transferList: [
          {
            bankAccountId: '',
            amount: '',
            remark: ''
          }
        ]
      },
      customers: [],
      bankAccountList: [],
      rules: {
        customer: [
          { required: true, message: '请选择一个客户', trigger: 'change' }
        ],
      }
    }
  },
  mounted() {
    this.getReceiveMoney()
    getAllCustomer({ params : { type: 'SELLER' } }).then(_res => {
      this.customers = _res.result
    })
    getAllCustomer({ params : { type: 'SUPPLIER' } }).then(_res => {
      this.customers = this.customers.concat(_res.result)
    })
    getAllBankAccount({}).then(_res => {
      let res = _res.result
      res.forEach(item => this.bankAccountList.push(item))
    })
  },
  methods: {
    getReceiveMoney() {
      getAllReceiveMoney({}).then(_res => {
        this.receiveMoneyList = _res.result
        this.pendingLevel1List = this.receiveMoneyList.filter(item => item.state === '待一级审批')
        this.pendingLevel2List = this.receiveMoneyList.filter(item => item.state === '待二级审批')
        this.successList = this.receiveMoneyList.filter(item => item.state === '审批完成')
        this.failureList = this.receiveMoneyList.filter(item => item.state === '审批失败')
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.resetForm()
            done();
          })
          .catch(_ => {});
    },
    resetForm() {
      this.receiveMoneyForm = {
        transferList: [
          {
            bankAccountId: '',
            amount: '',
            remark: ''
          }
        ]
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.receiveMoneyForm.id = null
          this.receiveMoneyForm.customer = parseInt(this.receiveMoneyForm.customer)
          this.receiveMoneyForm.operator = sessionStorage.getItem("name")
          this.receiveMoneyForm.state = null
          this.receiveMoneyForm.transferList.forEach((item) => {
            item.id = null
            item.bankAccountId = parseInt(item.bankAccountId)
            item.amount = Number(item.amount)
          })
          this.receiveMoneyForm.totalAmount = 0
          for (let receiveMoneyTransfer in this.receiveMoneyForm.transferList) {
            this.receiveMoneyForm.totalAmount += receiveMoneyTransfer.amount
          }
          let user = {
            name : sessionStorage.getItem("name"),
            role : sessionStorage.getItem("role"),
            password : null
          }
          createReceiveMoney(this.receiveMoneyForm).then(_res => {
            if (_res.msg === 'Success') {
              this.$message.success('创建成功！')
              this.dialogVisible = false
              this.resetForm()
              this.getReceiveMoney()
            }
          })
        }
      })
    },
    addBankAccount() {
      this.receiveMoneyForm.transferList.push({})
    },
    removeBankAccount(item) {
      let index = this.receiveMoneyForm.transferList.indexOf(item)
      if (index !== -1) {
        this.receiveMoneyForm.transferList.splice(index, 1)
      }
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