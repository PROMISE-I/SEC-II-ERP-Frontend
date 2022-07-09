<template>
  <Layout>
    <Title title="年终奖制定"></Title>
    <el-button type="primary" size="medium" @click="dialogVisible = true">制定年终奖</el-button>
    <div style="margin-top: 10px">
      <el-table
          :data="yearEndBonusList"
          stripe
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}">
        <el-table-column
            prop="staffId"
            label="员工id"
            width="100">
        </el-table-column>
        <el-table-column
            prop="name"
            label="员工姓名"
            width="200">
        </el-table-column>
        <el-table-column
            prop="year"
            label="年份"
            width="400">
        </el-table-column>
        <el-table-column
            prop="amount"
            label="年终奖总额（元）"
            width="400">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button
                @click="showEditDialog(scope.row.staffId)"
                type="text"
                size="small">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="制定年终奖"
               :visible.sync="dialogVisible"
               width="40%"
               :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="yearEndBonusForm" label-width="100px" ref="yearEndBonusForm" :rules="rules">
          <el-form-item label="员工: " prop="staffId">
            <el-select v-model="yearEndBonusForm.staffId" placeholder="请选择员工">
              <el-option
                  v-for="item in staffList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年份: " prop="year">
            <el-input v-model="yearEndBonusForm.year" disabled></el-input>
          </el-form-item>
          <el-form-item label="年终奖: " prop="amount">
            <el-input v-model="yearEndBonusForm.amount"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style="margin-right: 10px">
        <el-button type="primary" @click="queryAmount(yearEndBonusForm.staffId)">查询前11月工资</el-button>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('yearEndBonusForm')">确认新增</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑年终奖信息"
               :visible.sync="editDialogVisible"
               width="40%"
               :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="editForm" label-width="100px" ref="editForm" :rules="rules">
          <el-form-item label="员工: " prop="staffId">
            <el-select v-model="editForm.staffId" placeholder="请选择员工" disabled>
              <el-option
                  v-for="item in staffList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年份: " prop="year">
            <el-input v-model="editForm.year" disabled></el-input>
          </el-form-item>
          <el-form-item label="年终奖: " prop="amount">
            <el-input v-model="editForm.amount"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style="margin-right: 10px">
        <el-button type="primary" @click="queryAmount(editForm.staffId)">查询前11月工资</el-button>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm('editForm')">确认修改</el-button>
      </span>
    </el-dialog>
  </Layout>
</template>
<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import {
  getAllYearEndBonus,
  createYearEndBonus,
  updateYearEndBonus,
  findYearEndBonusByStaffId,
  getAllStaffExceptGM,
  getTotalAmountByStaffId
} from "@/network/yearEndBonus";
import {getAllStaff} from "@/network/staff";

export default {
  name: "YearEndBonusManagement",
  components: {
    Layout,
    Title
  },
  data() {
    return {
      yearEndBonusList: [],
      staffList: [],
      dialogVisible: false,
      yearEndBonusForm: {},
      editDialogVisible: false,
      editForm: {},
      rules: {
        staffId: [
          { required: true, message: '请选择员工', trigger: 'change'}
        ],
        year: [
          { required: true, message: '请输入时间', trigger: 'change'}
        ],
        amount: [
          { required: true, message: '请输入年终奖金额', trigger: 'change'}
        ]
      }
    }
  },
  mounted() {
    getAllStaffExceptGM({}).then(_res => {
      this.staffList = _res.result
      this.getData()
    })
    this.resetForm()
  },
  methods: {
    getData() {
      this.yearEndBonusList = []
      getAllYearEndBonus({}).then(_res => {
        _res.result.forEach(item => {
          item.name = this.showName(item.staffId)
          this.yearEndBonusList.push(item)
        })
      })
    },
    showName(id) {
      let ret = null
      this.staffList.forEach(staff => {
        if (staff.id == id) {
          ret = staff.name
        }
      })
      return ret
    },
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
          this.yearEndBonusForm.staffId = parseInt(this.yearEndBonusForm.staffId)
          this.yearEndBonusForm.year = new Date().getFullYear() - 1
          this.yearEndBonusForm.amount = Number(this.yearEndBonusForm.amount)

          createYearEndBonus(this.yearEndBonusForm).then(_res => {
            if (_res.msg === 'Success') {
              this.$message.success('创建成功！')
              this.dialogVisible = false
              this.resetForm()
              this.getData()
            } else if (_res.code === 'C00000' || _res.code === 'C00001') {
              this.$message.error(_res.msg)
            } else {
              console.log('Unknown Error!')
            }
          })
        }
      })
    },
    resetForm() {
      this.yearEndBonusForm = {
        year: new Date().getFullYear() - 1
      }
      this.editForm = {
        year: new Date().getFullYear() - 1
      }
    },
    showEditDialog(id_) {
      const config = {
        params: {
          staffId: id_,
          year: new Date().getFullYear() - 1
        }
      }
      findYearEndBonusByStaffId(config).then(_res => {
        if (_res.msg === 'Success') {
          let yearEndBonus = _res.result
          this.editForm.staffId = id_
          // this.editForm.amount = parseInt(yearEndBonus)
          this.editDialogVisible = true
        }
      })
    },
    queryAmount(staffId) {
      if (staffId === undefined) {
        this.$alert('请选择一个员工', '查询前 11 月总工资', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `查询失败！`
            });
          }
        });
        return
      }
      const config = {
        params: {
          staffId: staffId
        }
      }
      getTotalAmountByStaffId(config).then(_res => {
        this.$alert('前 11 月总工资为 ' + _res.result + ' 元', '查询前 11 月总工资', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'success',
              message: `查询成功!`
            });
          }
        });
      })
    },
    updateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editForm.id = parseInt(this.editForm.id)
          updateYearEndBonus(this.editForm).then(_res => {
            if (_res.msg === 'Success') {
              this.$message.success('修改成功！')
              this.editDialogVisible = false
              this.resetForm()
              this.getData()
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>