<template>
  <div class="card">
    <el-card v-for="(item, index) in list" :index="item.index" :key="item.id" shadow="hover">
      <template #header>
        <el-row>
          <el-col :span="18">
            <span><strong>id: </strong>{{item.id}}</span>
              <el-button style="margin-left: 10px"
                         type="primary" size="mini" @click="showEditDialog(item.level)">
                编辑
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
          <el-col :span="8">
            <span><strong>开始时间: </strong>{{formatDate(item.beginDate)}}</span>
          </el-col>
          <el-col :span="8">
            <span><strong>结束时间: </strong>{{formatDate(item.endDate)}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :span="3">
            <span><strong>对应的级别 </strong>{{item.level}}</span>
          </el-col>
          <el-col :span="6">
            <span><strong>折让比例 </strong>{{item.discount}}</span>
          </el-col>
          <el-col :span="6">
            <span><strong>代金券 </strong>{{item.coupon}}(元)</span>
          </el-col>
        </el-row>
        <div v-if="showAll[index]" style="margin-top: 15px">
          <div style="margin-bottom: 15px"><strong>赠品清单:</strong></div>
          <el-table
              :data="item.presentInfoList"
              stripe
              style="width: 100%"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
            <el-table-column
                prop="pid"
                label="商品id"
                width="500">
            </el-table-column>
            <el-table-column
                prop="quantity"
                label="数量"
                width="500">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-dialog
        title="修改促销策略"
        :visible.sync="editDialogVisible"
        width="40%"
        :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="editForm" label-width="100px" ref="editForm" :rules="rules">
          <el-form-item label="时间段" prop="date">
            <el-date-picker
                v-model="editForm.date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="对应级别: " prop="level">
            <el-input v-model="editForm.level" disabled></el-input>
          </el-form-item>
          <el-form-item label="折让比例: " prop="discount">
            <el-input v-model="editForm.discount"></el-input>
          </el-form-item>
          <el-form-item label="代金券: " prop="coupon">
            <el-input v-model="editForm.coupon"></el-input>
          </el-form-item>
          <el-form-item
              v-for="(item, index) in editForm.presentInfoList"
              :key="index"
              :label="'赠品' + (index + 1)">
            <div>
              <el-select v-model="item.pid" placeholder="请选择商品id" style="width: 40%; margin-right: 5%">
                <el-option
                    v-for="item1 in commodityList"
                    :key="item1.id"
                    :label="item1.id"
                    :value="item1.id">
                </el-option>
              </el-select>
              <el-input v-model="item.quantity" style="width: 25%; margin-right: 5%" placeholder="请输入商品数量"></el-input>
            </div>
            <div style="margin-top: 10px">
              <el-button type="text" size="small" @click="addProduct" v-if="index === editForm.presentInfoList.length - 1">添加</el-button>
              <el-button type="text" size="small" @click.prevent="removeProduct(item)" v-if="index !== 0">删除</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm('editForm')">立即修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {findLevelPromotionByLevel, updateLevelPromotion} from "@/network/promotion";
import {formatDate} from "@/common/utils";
import {getAllCommodity} from "@/network/commodity";

export default {
  name: "LevelPromotionList",
  props: {
    list: Array
  },
  data() {
    return {
      showAll: [],
      commodityList: [],
      editDialogVisible: false,
      editForm: {
        presentInfoList: [
          {
            pid: '',
            quantity: '',
          }
        ]
      },
      rules: {
        date: [
          { required: true, message: '请选择起止日期', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请输入对应级别', trigger: 'change' }
        ],
        discount: [
          { required: true, message: '请输入折扣', trigger: 'change' }
        ],
        coupon: [
          { required: true, message: '请输入代金券数额', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    beginDate: function () {
      return this.editForm.date === '' ? '' : formatDate(this.editForm.date[0])
    },
    endDate: function () {
      return this.editForm.date === '' ? '' : formatDate(this.editForm.date[1])
    }
  },
  mounted() {
    this.showAll = new Array(this.list.length).fill(false)
    getAllCommodity({}).then(_res => {
      let res = _res.result
      res.forEach(item => this.commodityList.push({ id: item.id }))
    })
  },
  methods: {
    changeState(index) {
      this.$set(this.showAll, index, !this.showAll[index])
    },
    formatDate,
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.resetForm()
            done();
          })
          .catch(_ => {
          });
    },
    showEditDialog(level) {
      findLevelPromotionByLevel({params: { level: level } }).then(_res => {
        if(_res.msg == 'Success'){
          let promotion = _res.result
          this.editForm = promotion
          if (this.editForm.presentInfoList === null) {
            this.editForm.presentInfoList = [
              {
                pid: '',
                quantity: '',
              }
            ]
          }
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
          this.editForm.level = parseInt(this.editForm.level)
          this.editForm.discount = Number(this.editForm.discount)
          this.editForm.coupon = Number(this.editForm.coupon)
          this.editForm.beginDate = this.beginDate
          this.editForm.endDate = this.endDate
          this.editForm.presentInfoList.forEach(item => {
            item.quantity = parseInt(item.quantity)
            item.level = this.editForm.level
          })
          updateLevelPromotion(this.editForm).then(_res => {
            if (_res.msg === 'Success') {
              this.$message.success('修改成功!')
              this.editDialogVisible = false
              this.resetForm()
              this.$emit('refresh')
            }
          })
        }
      })
    },
    resetForm() {
      this.editForm = {
        presentInfoList: [
          {
            pid: '',
            quantity: '',
          }
        ]
      }
    },
    addProduct() {
      this.editForm.presentInfoList.push({});
    },
    removeProduct(item) {
      let index = this.editForm.presentInfoList.indexOf(item)
      if (index !== -1) {
        this.editForm.presentInfoList.splice(index, 1)
      }
    }
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
</style>