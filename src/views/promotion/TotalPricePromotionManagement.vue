<template>
  <Layout>
    <Title title="基于总价的促销策略"></Title>
    <el-button type="primary" size="medium" @click="dialogVisible = true">制定促销策略</el-button>
    <div class="body">
      <total-price-promotion-list :list="promotionList" @refresh="getData()"/>
    </div>
    <el-dialog
        title="创建销售策略"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="promotionForm" label-width="100px" ref="promotionForm" :rules="rules">
          <el-form-item label="时间段" prop="date">
            <el-date-picker
                v-model="promotionForm.date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="总价阈值: " prop="threshold">
            <el-input v-model="promotionForm.threshold"></el-input>
          </el-form-item>
          <el-form-item label="优惠券金额: " prop="voucherAmount">
            <el-input v-model="promotionForm.voucherAmount"></el-input>
          </el-form-item>
          <el-form-item
              v-for="(item, index) in promotionForm.contentList"
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
              <el-input v-model="item.unitPrice" style="width: 25%;" placeholder="请输入商品单价"></el-input>
            </div>
            <div style="margin-top: 10px">
              <el-input v-model="item.remark" style="width: 70%; margin-right: 10%" placeholder="请填写备注"></el-input>
              <el-button type="text" size="small" @click="addProduct" v-if="index === promotionForm.contentList.length - 1">添加</el-button>
              <el-button type="text" size="small" @click.prevent="removeProduct(item)" v-if="index !== 0">删除</el-button>
            </div>
          </el-form-item>
          <el-form-item label="备注: ">
            <el-input type="textarea" v-model="promotionForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('promotionForm')">立即创建</el-button>
      </span>
    </el-dialog>
  </Layout>
</template>

<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import TotalPricePromotionList from "@/views/promotion/components/TotalPricePromotionList";
import {getAllTotalPricePromotion, createTotalPricePromotion} from "@/network/promotion";
import {getAllCommodity} from "@/network/commodity";
import {formatDate} from "@/common/utils";
export default {
  name: "TotalPricePromotionManagement",
  components: {
    Layout,
    Title,
    TotalPricePromotionList
  },
  computed: {
    beginDate: function () {
      return this.promotionForm.date === '' ? '' : formatDate(this.promotionForm.date[0])
    },
    endDate: function () {
      return this.promotionForm.date === '' ? '' : formatDate(this.promotionForm.date[1])
    }
  },
  data() {
    return {
      commodityList: [],
      dialogVisible: false,
      promotionList: [],
      promotionForm: {
        contentList: [
          {
            pid: '',
            quantity: '',
            unitPrice: '',
            remark: ''
          }
        ]
      },
      rules: {
        date: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        threshold: [
          { required: true, message: '请输入总价阈值', trigger: 'change' }
        ],
        voucherAmount: [
          { required: true, message: '请输入优惠券金额', trigger: 'change' }
        ],
      }
    }
  },
  mounted() {
    this.getData()
    getAllCommodity({}).then(_res => {
      let res = _res.result
      res.forEach(item => this.commodityList.push(item))
    })
  },
  methods: {
    getData() {
      getAllTotalPricePromotion({}).then(_res => {
        this.promotionList = _res.result
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.promotionForm.id = null
          this.promotionForm.thredhold = Number(this.promotionForm.threshold)
          this.promotionForm.voucherAmount = Number(this.promotionForm.voucherAmount)
          this.promotionForm.beginTimeStr = this.beginDate
          this.promotionForm.endTimeStr = this.endDate
          if (this.promotionForm.hasContent === false) {
            this.promotionForm.contentList = []
          } else {
            this.promotionForm.contentList.forEach((item) => {
              item.id = null
              item.quantity = parseInt(item.quantity)
              item.unitPrice = parseInt(item.unitPrice)
              item.totalAmount = item.quantity * item.unitPrice
            })
          }
          createTotalPricePromotion(this.promotionForm).then(_res => {
            if (_res.msg === 'Success') {
              this.$message.success('创建成功!')
              this.dialogVisible = false
              this.resetForm()
              this.getData()
            }
          })
        }
      })
    },
    resetForm() {
      this.promotionForm = {
        contentList: [
          {
            pid: '',
            quantity: '',
            unitPrice: '',
            remark: ''
          }
        ]
      }
    },
    addProduct() {
      this.promotionForm.contentList.push({});
    },
    removeProduct(item) {
      let index = this.promotionForm.contentList.indexOf(item)
      if (index !== -1) {
        this.promotionForm.contentList.splice(index, 1)
      }
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