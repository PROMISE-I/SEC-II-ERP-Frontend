<template>
  <Layout>
    <Title title="员工管理"></Title>
    <el-button type="primary" size="medium" @click="dialogVisible = true">新增员工</el-button>
    <div style="margin-top: 10px">
      <el-table
          :data="staffList"
          stripe
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}">
        <el-table-column
            prop="id"
            label="id"
            width="80">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="120">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            width="120">
        </el-table-column>
        <el-table-column
            prop="birthday"
            label="出生日期"
            width="200">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="手机号"
            width="230">
        </el-table-column>
        <el-table-column
            prop="position"
            label="职位"
            width="250">
        </el-table-column>
        <el-table-column
            prop="balance"
            label="工资卡账户"
            width="120">
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
    <el-dialog title="新增员工"
               :visible.sync="dialogVisible"
               width="40%"
               :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="staffForm" label-width="100px" ref="staffForm" :rules="rules">
          <el-form-item label="姓名: " prop="name">
            <el-input v-model="staffForm.name"></el-input>
          </el-form-item>
          <el-form-item label="性别: " prop="gender">
            <el-select v-model="staffForm.gender" placeholder="请选择性别">
              <el-option
                  v-for="item in genderList" :key="item.id" :value="item">
                {{ item }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期: " prop="birthday">
            <el-date-picker
                v-model="staffForm.birthday"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="手机号: " prop="phone">
            <el-input v-model="staffForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="职位: " prop="position">
            <el-select v-model="staffForm.position">
              <el-option
                  v-for="item in positionList" :key="item.id" :value="item.title" :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('staffForm')">确认新增</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑员工信息"
               :visible.sync="editDialogVisible"
               width="40%"
               :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="editForm" label-width="100px" ref="editForm" :rules="rules">
          <el-form-item label="姓名: " prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="性别: " prop="gender">
            <el-select v-model="editForm.gender" placeholder="请选择性别">
              <el-option
                  v-for="item in genderList" :key="item.id" :value="item">
                {{ item }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期: " prop="birthday">
            <el-date-picker
                v-model="editForm.birthday"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="手机号: " prop="phone">
            <el-input v-model="editForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="职位: " prop="position">
            <el-select v-model="editForm.position">
              <el-option
                  v-for="item in positionList" :key="item.id" :value="item.title" :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm('editForm')">确认修改</el-button>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteStaff">删除</el-button>
      </span>
    </el-dialog>
  </Layout>
</template>

<!-- TODO：加入输入格式检查，页面美化 -->

<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import {
  getAllStaff,
  createStaff,
  deleteStaff,
  updateStaff,
  findStaffById
} from "@/network/staff"
export default {
  name: "StaffManagement",
  components: {
    Layout,
    Title
  },
  data() {
    return {
      staffList: [],
      dialogVisible: false,
      staffForm: {
        name: '',
        gender: '',
        birthday: '',
        phone: '',
        position: '',
        balance: ''
      },
      editDialogVisible: false,
      editForm: {},
      genderList: ['男', '女'],
      positionList: [
        { id: 0, title: 'FINANCIAL_STAFF', label: '财务人员' },
        { id: 1, title: 'GM', label: '总经理' },
        { id: 2, title: 'HR', label: '人力资源人员' },
        { id: 3, title: 'INVENTORY_MANAGER', label: '库存管理人员' },
        { id: 4, title: 'SALE_MANAGER', label: '销售经理'},
        { id: 5, title: 'SALE_STAFF', label: '进货销售人员' },
      ],
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        birthday: [
          { required: true, message: '请选择生日', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' }
        ],
        position: [
          { required: true, message: '请选择岗位', trigger: 'change' }
        ],
      }
    }
  },
  async mounted() {
    await getAllStaff({ params : {}}).then(_res => {
      this.staffList = this.staffList.concat(_res.result)
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
    getDateStr(date) {
      let ret = String(date.getFullYear())
      while (ret.length < 4) {
        ret = '0' + ret
      }
      ret += '-'
      let cur = String(date.getMonth() + 1)
      while (cur.length < 2) {
        cur = '0' + cur
      }
      ret += cur + '-'
      cur = String(date.getDate())
      while (cur.length < 2) {
        cur = '0' + cur
      }
      ret += cur
      return ret
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.staffForm.id = null
          this.staffForm.balance = 0
          let date = this.staffForm.birthday
          this.staffForm.birthday = this.getDateStr(date)

          createStaff(this.staffForm).then(_res => {
            if (_res.msg === 'Success') {
              this.$message.success('创建成功!')
              this.dialogVisible = false
              this.resetForm()
              this.staffList = []
              getAllStaff({ params : {} }).then(_res => {
                this.staffList = this.staffList.concat(_res.result)
              })
            }
          })
        }
      })
    },
    resetForm() {
      this.staffForm = {}
      this.editForm = {}
    },
    showEditDialog(id_) {
      findStaffById({params: { staffId: id_ }}).then(_res => {
        if(_res.msg == 'Success'){
          let staff = _res.result
          this.editForm = staff
          this.editForm.birthday = new Date(this.editForm.birthday)
          this.editDialogVisible = true
        } else {
          console.log('Something wrong!')
          alert('Something wrong!')
        }
      })
    },
    updateForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editForm.id = parseInt(this.editForm.id)
          let date = this.editForm.birthday
          this.editForm.birthday = this.getDateStr(date)
          console.log(this.editForm.birthday)

          updateStaff(this.editForm).then(_res => {
            if (_res.msg === 'Success') {
              this.$message.success('修改成功!')
              this.editDialogVisible = false
              this.resetForm()
              this.staffList = []
              getAllStaff({ params : {} }).then(_res => {
                this.staffList = this.staffList.concat(_res.result)
              })
            }
          })
        }
      })
    },
    deleteStaff() {
      deleteStaff({params: {id: this.editForm.id}}).then(_res => {
        if(_res.msg == 'Success'){
          this.$message.success('删除成功!')
          this.editDialogVisible = false
          this.resetForm()
          this.staffList = []
          getAllStaff({ params : {} }).then(_res => {
            this.staffList = this.staffList.concat(_res.result)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>