<template>
  <Layout>
    <Title title="岗位管理"></Title>
<!--    <el-button type="primary" size="medium" @click="dialogVisible = true">新增客户</el-button>-->
    <div style="margin-top: 10px">
      <el-table
          :data="positionList"
          stripe
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}">
        <el-table-column
            prop="title"
            label="名称"
            width="70">
        </el-table-column>
        <el-table-column
            prop="baseSalary"
            label="基本工资"
            width="100">
        </el-table-column>
        <el-table-column
            prop="specialSalary"
            label="岗位工资"
            width="100">
        </el-table-column>
        <el-table-column
            prop="level"
            label="岗位级别"
            width="100">
        </el-table-column>
        <el-table-column
            prop="salaryCalculationMethod"
            label="薪资计算方式"
            width="300">
        </el-table-column>
        <el-table-column
            prop="salaryPayMethod"
            label="薪资发放方式"
            width="300">
        </el-table-column>
        <el-table-column
            prop="tax"
            label="扣税信息"
            width="100">
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
    <el-dialog title="编辑岗位信息"
               :visible.sync="editDialogVisible"
               width="40%"
               :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="editForm" label-width="100px" ref="editForm" :rules="rules">
          <el-form-item label="名称: " prop="title">
            <el-input v-model="editForm.title"></el-input>
            <!-- TODO: 名称不可修改 -->
          </el-form-item>
          <el-form-item label="基本工资: " prop="baseSalary">
            <el-input v-model="editForm.baseSalary"></el-input>
          </el-form-item>
          <el-form-item label="岗位工资: " prop="specialSalary">
            <el-input v-model="editForm.specialSalary"></el-input>
          </el-form-item>
          <el-form-item label="岗位级别: " prop="level">
            <el-input v-model="editForm.level"></el-input>
          </el-form-item>
          <el-form-item label="薪资计算方式: " prop="salaryCalculationMethod">
            <el-input v-model="editForm.salaryCalculationMethod"></el-input>
          </el-form-item>
          <el-form-item label="薪资发放方式: " prop="salaryPayMethod">
            <el-input v-model="editForm.salaryPayMethod"></el-input>
          </el-form-item>
          <el-form-item label="扣税信息: " prop="tax">
            <el-input v-model="editForm.tax"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm('editForm')">确认修改</el-button>
      </span>
    </el-dialog>
  </Layout>
</template>
<!-- TODO -->
<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import {
  getAllPosition,
  updatePosition,
  findPositionByTitle
} from "../../network/staff"
export default {
  name: "PositionManagement",
  components: {
    Layout,
    Title
  },
  data() {
    return {
      positionList: [],
      diaLogVisible: false,
      editForm: {},
      editDialogVisible: false
    }
  },
  async mounted() {
    await getAllPosition({ params : {} }).then(_res => {
      this.positionList = this.positionList.concat(_res.result)
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
    resetForm() {
      this.editForm = {}
    },
    showEditDialog(title_){
      findPositionByTitle({params: { title: title_}}).then(_res => {
        if(_res.msg == 'Success'){
          let position = _res.result
          this.editForm = position
          this.editDialogVisible = true
        }else {
          console.log('Something wrong!')
          alert('Something wrong!')
        }
      })
    },
    updateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editForm.baseSalary = Number(this.editForm.baseSalary)
          this.editForm.specialSalary = Number(this.editForm.specialSalary)
          this.editForm.level = parseInt(this.editForm.level)
          this.tax = Number(this.editForm.tax)

          updatePosition(this.editForm).then(_res => {
            if (_res.msg == 'Success') {
              this.$message.success('修改成功!')
              this.editDialogVisible = false
              this.resetForm()
              this.positionList = []
              getAllPosition({params: {}}).then(_res => {
                this.positionList = this.positionList.concat(_res.result)
              })
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