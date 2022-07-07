<template>
  <Layout>
    <Title title="工资单管理"></Title>
    <el-button type="primary" size="medium" @click="dialogVisible = true">制定工资单</el-button>
    <div class="body">
      <el-tabs v-model="activeName" :stretch="true">
        <el-tab-pane label="待一级审批" name="PENDING_LEVEL_1">
          <div v-if="pendingLevel1List.length === 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div v-else>
            <salary-list :list="pendingLevel1List" :type="1" @refresh="getSalary()"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待二级审批" name="PENDING_LEVEL_2">
          <div v-if="pendingLevel2List.length === 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div v-else>
            <salary-list :list="pendingLevel2List" :type="2" @refresh="getSalary()"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审批完成" name="SUCCESS">
          <div v-if="successList.length === 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div v-else>
            <salary-list :list="successList" :type="3"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审批失败" name="FAILURE">
          <div v-if="failureList.length === 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div v-else>
            <salary-list :list="failureList" :type="4"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
        title="创建工资单"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="salaryForm" label-width="100px" ref="salaryForm" :rules="rules">
          <el-form-item label="员工: " prop="employeeId">
            <el-select v-model="salaryForm.employeeId" placeholder="请选择员工">
              <el-option
                  v-for="item in staffs"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="银行账户: " prop="bankAccountId">
            <el-select v-model="salaryForm.bankAccountId" placeholder="请选择银行账户">
              <el-option
                  v-for="item in bankAccountList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('salaryForm')">立即创建</el-button>
      </span>
    </el-dialog>
  </Layout>
</template>

<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import SalaryList from "@/views/staff/components/SalaryList";
import {
  getAllSalary,
  createSalary,
  getSalaryAmountByStaffId
} from "@/network/staff";
import { getAllStaff } from "@/network/staff";
import { getAllBankAccount } from "@/network/accountManagement";

export default {
  name: "SalarySheetManagement",
  components: {
    Layout,
    Title,
    SalaryList
  },
  data() {
    return {
      activeName: 'PENDING_LEVEL_1',
      salaryList: [],
      pendingLevel1List: [],
      pendingLevel2List: [],
      successList: [],
      failureList: [],
      dialogVisible: false,
      salaryForm: {},
      staffs: [],
      bankAccountList: [],
      rules: {
        employeeId: [
          { required: true, message: '请选择一个员工', trigger: 'change' }
        ],
        bankAccountId: [
          { required: true, message: '请选择一个公司账户', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.getSalary()
    getAllStaff({}).then(_res => {
      this.staffs = _res.result
    })
    getAllBankAccount({}).then(_res => {
      let res = _res.result
      res.forEach(item => this.bankAccountList.push(item))
    })
  },
  methods: {
    getSalary() {
      getAllSalary({}).then(_res => {
        this.salaryList = _res.result
        this.pendingLevel1List = this.salaryList.filter(item => item.state === '待一级审批')
        this.pendingLevel2List = this.salaryList.filter(item => item.state === '待二级审批')
        this.successList = this.salaryList.filter(item => item.state === '审批完成')
        this.failureList = this.salaryList.filter(item => item.state === '审批失败')
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
      this.salaryForm = {}
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.salaryForm.id = null
          this.salaryForm.employeeId = parseInt(this.salaryForm.employeeId)
          // 注意此处为 employeeId 而不是 staffId
          this.salaryForm.staffName = null
          this.salaryForm.bankAccountId = parseInt(this.salaryForm.bankAccountId)
          // 注意此处为 bankAccountId 而不是 companyBankAccountId
          this.salaryForm.rawSalary = null
          this.salaryForm.tax = null
          this.salaryForm.actualSalary = null
          this.salaryForm.state = null
          this.salaryForm.createDate = null
          let config = {
            params: {
              employeeId: this.salaryForm.employeeId,
              bankAccountId: this.salaryForm.bankAccountId
            }
          }
          createSalary(config).then(_res => {
            if (_res.msg === 'Success') {
              this.$message.success('创建成功！')
              this.dialogVisible = false
              this.resetForm()
              this.getSalary()
            } else {
              if (_res.code === 'B00000' || _res.code === 'B00001' || _res.code === 'B00002' || _res.code === 'B00003') {
                this.$message.warning(_res.msg)
                this.dialogVisible = false
                this.resetForm()
                this.getSalary()
              } else {
                console.log('制定工资单时发生未知错误')
                alert('制定工资单时发生未知错误！')
              }
            }
          })

        }
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