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
            width="60">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="100">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            width="100">
        </el-table-column>
        <el-table-column
            prop="birthday"
            label="出生日期"
            width="100">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="手机号"
            width="150">
        </el-table-column>
        <el-table-column
            prop="position"
            label="职位"
            width="150">
        </el-table-column>
        <el-table-column
            prop="balance"
            label="工资卡账户"
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
    <el-dialog title="新增员工"
               :visible.sync="dialogVisible"
               width="40%"
               :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="staffForm" label-width="100px" ref="staffForm">
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
            <el-input v-model="staffForm.birthday"></el-input>
          </el-form-item>
          <el-form-item label="手机号: " prop="phone">
            <el-input v-model="staffForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="职位: " prop="position">
            <el-input v-model="staffForm.position"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('staffForm')">确认新增</el-button>
      </span>
    </el-dialog>

  </Layout>
</template>

<script>
export default {
  name: "TotalPricePromotionManagement"
}
</script>

<style scoped>

</style>