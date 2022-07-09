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
        </el-row>
      </template>
      <div>
        <el-row>
          <el-col :span="3">
            <span><strong>员工id: </strong>{{item.staffId}}</span>
          </el-col>
          <!-- TODO: 显示员工姓名 -->
          <el-col :span="3">
            <span><strong>银行账户id: </strong>{{item.companyBankAccountId}}</span>
          </el-col>
          <!-- TODO: 显示银行账户名称 -->
          <el-col :span="6">
            <span><strong>应发工资: </strong>{{item.rawSalary}}(元)</span>
          </el-col>
          <el-col :span="6">
            <span><strong>扣除税款: </strong>{{item.tax}}(元)</span>
          </el-col>
          <el-col :span="6">
            <span><strong>实发工资: </strong>{{item.actualSalary}}(元)</span>
          </el-col>
        </el-row>
      </div>
    </el-card>
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
          <el-form-item label="应发工资: " prop="rawSalary">
            <el-input v-model="salaryForm.rawSalary" placeholder="请输入应发工资"></el-input>
          </el-form-item>
          <el-form-item label="扣除税款: " prop="tax">
            <el-input v-model="salaryForm.tax" placeholder="请输入扣除税款"></el-input>
          </el-form-item>
          <el-form-item label="实发工资: " prop="actualSalary">
            <el-input v-model="salaryForm.actualSalary" placeholder="请输入实发工资"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('salaryForm')">立即创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getAllStaff, createSalaryByContent} from "@/network/staff";
import {getAllBankAccount} from "@/network/accountManagement";
import {deepCopy} from "@/common/utils";
import {querySheetIdExist} from "@/network/financialManagement";

export default {
  name: "BHSalaryList",
  props: {
    list: Array
  },
  data() {
    return {
      showAll: [],
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
        ],
        rawSalary: [
          { required: true, message: '请输入应发工资', trigger: 'change' }
        ],
        tax: [
          { required: true, message: '请输入扣除税款', trigger: 'change' }
        ],
        actualSalary: [
          { required: true, message: '请输入实发工资', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.showAll = new Array(this.list.length).fill(false)
    getAllStaff({}).then(_res => {
      this.staffs = _res.result
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
      this.salaryForm = {}
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let id = this.salaryForm.id
          this.salaryForm.id += '-1'
          this.salaryForm.employeeId = parseInt(this.salaryForm.employeeId)
          // 注意此处为 employeeId 而不是 staffId
          this.salaryForm.bankAccountId = parseInt(this.salaryForm.bankAccountId)
          // 注意此处为 bankAccountId 而不是 companyBankAccountId
          this.salaryForm.rawSalary = Number(this.salaryForm.rawSalary)
          this.salaryForm.tax = Number(this.salaryForm.tax)
          this.salaryForm.actualSalary = Number(this.salaryForm.actualSalary)
          this.salaryForm.state = null
          this.salaryForm.createDate = null
          createSalaryByContent(this.salaryForm).then(_res => {
            if (_res.msg === 'Success') {
              this.$message.success('复制成功！')
              this.dialogVisible = false
              this.reverseCreate(id)
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
    },
    reverseCreate(id) {
      // TODO：红冲功能
      const config = {
        params: {
          sheetId: id + '-0'
        }
      }
      querySheetIdExist(config).then(_res => {
        if (_res.result === true) {
          this.$message.error('该单据已经使用过红冲功能！')
          return
        }
        let form = null
        this.list.forEach(item => {
          if (id == item.id) {
            form = deepCopy(item)
          }
        })
        form.state = null
        form.employeeId = parseInt(form.staffId)
        form.rawSalary = -form.rawSalary
        form.tax = -form.tax
        form.actualSalary = -form.actualSalary
        form.id += '-0'
        console.log(form)
        createSalaryByContent(form).then(_res => {
          if (_res.msg === 'Success') {
            this.$message.success('红冲成功！')
            this.$emit('refresh')
          }
        })
      })
    },
    reverseAndDuplicateCreate(id) {
      // TODO：红冲并复制
      const config = {
        params: {
          sheetId: id + '-0'
        }
      }
      querySheetIdExist(config).then(_res => {
        if (_res.result === true) {
          this.$message.error('该单据已经使用过红冲功能！')
          return
        }
        let form = null
        this.list.forEach(item => {
          if (item.id === id) {
            form = deepCopy(item)
          }
        })
        form.employeeId = form.staffId
        this.salaryForm = form
        this.dialogVisible = true
      })
    },
    exportAsExcel() {
      // TODO ：导出 Excel 功能
      let curTime = new Date().getTime()
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '员工id', '银行账户id', '应发工资', '扣除税款', '实发工资']
        const filterVal = ['id', 'staffId', 'companyBankAccountId', 'rawSalary', 'tax', 'actualSalary']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        const filename = 'business-history-salary' + curTime
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