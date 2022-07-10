<template>
  <div class="card">
    <el-button @click="exportAsExcel()">导出Excel</el-button>
    <el-card v-for="(item, index) in list" :index="item.index" :key="item.id" shadow="hover">
      <template #header>
        <el-row>
          <el-col :span="18">
            <span><strong>id: </strong>{{item.id}}</span>
            <el-popconfirm
                title="确定要使用红冲功能吗？"
                @confirm="reverseCreate(item.id)"
            >
              <el-button v-if="isGM() === false" style="margin-left: 10px"
                         type="danger" size="mini" slot="reference">
                红冲
              </el-button>
            </el-popconfirm>
            <el-button v-if="isGM() === false" style="margin-left: 10px"
                       type="danger" size="mini" @click="reverseAndDuplicateCreate(item.id)">
              红冲并复制
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button class="button" type="text"
                       v-if="!showAll[index]"
                       @click="changeState(index)">
              展开
            </el-button>
            <el-button class="button" type="text"
                       v-if="showAll[index]"
                       @click="changeState(index)">
              收起</el-button>
          </el-col>
        </el-row>
      </template>
      <div>
        <el-row>
          <el-col :span="3">
            <span><strong>客户id: </strong>{{item.customer}}</span>
          </el-col>
          <el-col :span="3">
            <span><strong>操作员: </strong>{{item.operator}}</span>
          </el-col>
          <el-col :span="6">
            <span><strong>转账总额: </strong>{{item.totalAmount}}(元)</span>
          </el-col>
        </el-row>
        <div v-if="showAll[index]" style="margin-top: 15px">
          <div style="margin-bottom: 15px"><strong>转账清单列表:</strong></div>
          <el-table
              :data="item.transferList"
              stripe
              style="width: 100%"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
            <el-table-column
                prop="bankAccountId"
                label="银行账户id"
                width="200">
            </el-table-column>
            <el-table-column
                prop="amount"
                label="转账金额(元)"
                width="200">
            </el-table-column>
            <el-table-column
                prop="remark"
                label="备注">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-dialog
        title="创建付款单"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="payMoneyForm" label-width="100px" ref="payMoneyForm" :rules="rules">
          <el-form-item label="客户: " prop="customer">
            <el-select v-model="payMoneyForm.customer" placeholder="请选择客户">
              <el-option
                  v-for="item in customers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
              v-for="(item, index) in payMoneyForm.transferList"
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
              <el-button type="text" size="small" @click="addBankAccount" v-if="index === payMoneyForm.transferList.length - 1">添加</el-button>
              <el-button type="text" size="small" @click.prevent="removeBankAccount(item)" v-if="index !== 0">删除</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('payMoneyForm')">立即创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getAllCustomer} from "@/network/purchase";
import {getAllBankAccount} from "@/network/accountManagement";
import {createPayMoney} from "@/network/financialManagement";
import {deepCopy} from "@/common/utils";
import {querySheetIdExist} from "@/network/financialManagement";

export default {
  name: "BHPayMoneyList",
  props: {
    list: Array
  },
  data() {
    return {
      showAll: [],
      dialogVisible: false,
      payMoneyForm: {
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
    this.showAll = new Array(this.list.length).fill(false)
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
    changeState(index) {
      this.$set(this.showAll, index, !this.showAll[index])
    },
    isGM() {
      if (sessionStorage.getItem('role') === 'GM') return true
      return false
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
      this.payMoneyForm = {
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
          let id = this.payMoneyForm.id
          this.payMoneyForm.id += '-1'
          this.payMoneyForm.customer = parseInt(this.payMoneyForm.customer)
          this.payMoneyForm.state = null
          this.payMoneyForm.transferList.forEach((item) => {
            item.id = null
            item.bankAccountId = parseInt(item.bankAccountId)
            item.amount = Number(item.amount)
          })
          this.payMoneyForm.totalAmount = 0
          for (let payMoneyTransfer in this.payMoneyForm.transferList) {
            this.payMoneyForm.totalAmount += payMoneyTransfer.amount
          }
          createPayMoney(this.payMoneyForm).then(_res => {
            if (_res.msg === 'Success') {
              this.$message.success('复制成功！')
              this.dialogVisible = false
              this.resetForm()
              this.reverseCreate(id)
            }
          })
        }
      })
    },
    reverseCreate(id) {
      // 红冲功能
      const config = {
        params: {
          sheetId: id + '-0'
        }
      }
      querySheetIdExist(config).then(_res => {
        if (_res.result === true) {
          this.$message.error('该单据已经使用红冲功能！')
          return
        }
        let form = null
        this.list.forEach(item => {
          if (item.id === id) {
            form = deepCopy(item)
          }
        })
        console.log(form)
        for (let item of form.transferList) {
          item.amount = -item.amount
          item.id = null
        }
        form.state = null
        form.finalAmount = null
        form.id = form.id + '-0'
        createPayMoney(form).then(_res => {
          if (_res.msg === 'Success') {
            this.$message.success('红冲成功！')
            this.$emit('refresh')
          }
        })
      })
    },
    reverseAndDuplicateCreate(id) {
      // 红冲并复制
      const config = {
        params: {
          sheetId: id + '-0'
        }
      }
      querySheetIdExist(config).then(_res => {
        if (_res.result === true) {
          this.$message.error('该单据已经使用红冲功能！')
          return
        }
        let form = null
        this.list.forEach(item => {
          if (item.id === id) {
            form = deepCopy(item)
          }
        })
        this.payMoneyForm = form
        this.dialogVisible = true
      })
    },
    addBankAccount() {
      this.payMoneyForm.transferList.push({})
    },
    removeBankAccount(item) {
      let index = this.payMoneyForm.transferList.indexOf(item)
      if (index !== -1) {
        this.payMoneyForm.transferList.splice(index, 1)
      }
    },
    exportAsExcel() {
      // 导出 Excel 功能
      let curTime = new Date().getTime()
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '客户id', '操作员', '转账总额', '备注']
        const filterVal = ['id', 'customer', 'operator', 'totalAmount', 'remark']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        const filename = 'business-history-pay-money' + curTime
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename,
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
      let contentList = []
      for (let item of this.list) {
        for (let content of item.transferList) {
          let tmp = content
          tmp.outId = item.id
          contentList.push(tmp)
        }
      }
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '银行账户id', '转账金额（元）', '备注']
        const filterVal = ['outId', 'bankAccountId', 'amount', 'remark']
        const list = contentList
        const data = this.formatJson(filterVal, list)
        const filename = 'business-history-pay-money-content' + curTime
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename,
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 80%;
  margin: 0 auto;
  .button {
    float: right;
    padding: 3px 0
  }
}
.el-card {
  margin-bottom: 20px;
  background: #EEF7F2;
}
.body {
  margin: 0 auto;
  margin-top: 10px;
  height: 80vh;
  overflow-y: auto;
  width: 100%;
  background: rgba($color: #fff, $alpha: 0.5);
}
</style>