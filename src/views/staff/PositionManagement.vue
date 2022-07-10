<template>
  <Layout>
    <Title title="岗位管理"></Title>
    <div style="margin-top: 10px">
      <el-table
          :data="positionList"
          stripe
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}">
        <el-table-column
            prop="title"
            label="Title"
            width="160">
        </el-table-column>
        <el-table-column
            prop="name"
            label="岗位名称"
            width="160">
        </el-table-column>
        <el-table-column
            prop="baseSalary"
            label="基本工资（元）"
            width="130">
        </el-table-column>
        <el-table-column
            prop="specialSalary"
            label="岗位工资（元）"
            width="130">
        </el-table-column>
        <el-table-column
            prop="level"
            label="岗位级别"
            width="100">
        </el-table-column>
        <el-table-column
            prop="salaryCalculateMethod"
            label="薪资计算方式"
            width="230">
        </el-table-column>
        <el-table-column
            prop="salaryPaymentMethod"
            label="薪资发放方式"
            width="230">
        </el-table-column>
        <el-table-column
            prop="tax"
            label="扣税信息"
            width="200">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button
                @click="showEditDialog(scope.row.title)"
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
          <el-form-item label="Title: " prop="title">
            <el-input v-model="editForm.title" disabled></el-input>
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
          <el-form-item label="薪资计算方式: " prop="salaryCalculateMethod">
            <el-input v-model="editForm.salaryCalculateMethod" disabled></el-input>
          </el-form-item>
          <el-form-item label="薪资发放方式: " prop="salaryPaymentMethod">
            <el-input v-model="editForm.salaryPaymentMethod" disabled></el-input>
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
<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import {
  getAllPosition, // 获取所有 Position 的 Title
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
      positionTitleList: [],
      positionList: [],
      diaLogVisible: false,
      editForm: {},
      editDialogVisible: false,
      rules: {
        baseSalary: [
          { required: true, message: '请输入基本工资', trigger: 'change' }
        ],
        specialSalary: [
          { required: true, message: '请输入岗位工资', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请输入岗位级别', trigger: 'change' }
        ],
        tax: [
          { required: true, message: '请输入扣税信息', trigger: 'change' }
        ]
      }
    }
  },
  async mounted() {
    this.positionTitleList = ['FINANCIAL_STAFF', 'GM', 'HR', 'INVENTORY_MANAGER', 'SALE_MANAGER', 'SALE_STAFF']
    // await getAllPosition({ params : {} }).then(_res => {
    //   this.positionList = _res.result
    // })
    this.getPositionInfo()
  },
  methods: {
    getPositionInfo() {
      this.positionList = []
      getAllPosition({}).then(_res => {
        let rawPositionList = _res.result
        rawPositionList.forEach(item => {
          item.name = this.getName(item.title)
          this.positionList.push(item)
        })
      })
      // for (let title of this.positionTitleList) {
      //   findPositionByTitle({ params: { title: title } }).then(_res => {
      //     let info = _res.result
      //     info.name = this.getName(info.title)
      //     this.positionList.push(info)
      //   })
      // }
      // this.positionList.sort(function (a, b) {
      //   let ta = a.title, tb = b.title
      //   if (ta < tb) {
      //     return -1
      //   } else if (ta > tb) {
      //     return 1
      //   } else {
      //     return 0
      //   }
      // })
    },
    getName(title) {
      const nameMap = {
        INVENTORY_MANAGER: '库存管理人员',
        SALE_STAFF: '进货销售人员',
        SALE_MANAGER: '销售经理',
        FINANCIAL_STAFF: '财务人员',
        HR: '人力资源人员',
        GM: '总经理'
      }
      return nameMap[title]
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
      this.editForm = {}
    },
    showEditDialog(title_){
      findPositionByTitle({params: { title: title_ } }).then(_res => {
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
              this.getPositionInfo()
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