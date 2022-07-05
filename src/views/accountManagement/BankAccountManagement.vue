<template>
  <Layout>
    <Title title="银行账户管理"></Title>
    <el-button type="primary" size="medium" @click="dialogVisible = true">新增账户</el-button>
    <div style="margin-top: 10px">
      <el-table
          :data="bankAccountList"
          stripe
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}">
        <el-table-column
            prop="name"
            label="名称"
            width="800">
        </el-table-column>
        <el-table-column
            prop="amount"
            label="金额"
            width="250">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button
                @click="showEditDialog(scope.row.id)"
                type="text"
                size="small">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新增账户"
               :visible.sync="dialogVisible"
               width="40%"
               :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="accountForm" label-width="100px" ref="accountForm" :rules="rules">
          <el-form-item label="名称: " prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="金额: " prop="amount">
            <el-input v-model="accountForm.amount"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('accountForm')">确认新增</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑账户信息"
               :visible.sync="editDialogVisible"
               width="40%"
               :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="editForm" label-width="100px" ref="editForm" :rules="rules">
          <el-form-item label="名称: " prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm('editForm')">确认修改</el-button>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteCustomer">删除</el-button>
      </span>
    </el-dialog>
  </Layout>
</template>

<!-- TODO 需要更改 api 接口，加入模糊查找的功能，完善剩下的部分 -->

<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import {
  getAllBankAccount,
  createBankAccount,
  deleteBankAccount,
  updateBankAccount,
  findBankAccountByAmbiguousName,
  findBankAccountById
} from "../../network/accountManagement";
export default {
  name: 'BankAccountManagement',
  components: {
    Layout,
    Title
  },
  data() {
    return {
      bankAccountList: [],
      accountForm: {},
      dialogVisible: false,
      editDialogVisible: false,
      editForm: {}
    }
  },
  async mounted() {
    await getAllBankAccount({ params : {} }).then(_res => {
      this.bankAccountList = this.bankAccountList.concat(_res.result)
    })
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.resetForm()
            done();
          })
          .catch(_ => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.accountForm.id = null
          this.accountForm.amount = parseInt(this.accountForm.amount)
          createBankAccount(this.accountForm).then(_res => {
            if (_res.msg === 'Success') {
              this.$message.success('创建成功!')
              this.dialogVisible = false
              this.resetForm()
              this.customerList = []
              getAllBankAccount({ params : {} }).then(_res => {
                this.customerList = this.customerList.concat(_res.result)
              })
            }
          })
        }
      })
    },
    resetForm() {
      this.accountForm = {}
      this.editForm = {}
    },
    showEditDialog(id_){
      findBankAccountById({ params: { bankAccountId : id_ } }).then(_res => {
        if(_res.msg == 'Success'){
          let bankAccount = _res.result
          this.editForm = bankAccount
          this.editDialogVisible = true
        }else {
          console.log('Something wrong!')
          alert('Something wrong!')
        }
      })
    },
    updateForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateBankAccount({ params: { bankAccountId : this.editForm.id, newBankAccountName : this.editForm.name } }).then(_res => {
            if (_res.msg === 'Success') {
              this.$message.success('修改成功!')
              this.editDialogVisible = false
              this.resetForm()
              this.bankAccountList = []
              getAllBankAccount({ params : {} }).then(_res => {
                this.bankAccountList = this.bankAccountList.concat(_res.result)
              })
            }
          })
        }
      })
    },
    deleteCustomer(){
      deleteBankAccount({ params: { bankAccountId: this.editForm.id } } ).then(_res => {
        if(_res.msg == 'Success'){
          this.$message.success('删除成功!')
          this.editDialogVisible = false
          this.resetForm()
          this.bankAccountList = []
          getAllBankAccount({ params : {} }).then(_res => {
            this.bankAccountList = this.bankAccountList.concat(_res.result)
          })
        }
      })
    }
  }
}
</script>

<style>

</style>