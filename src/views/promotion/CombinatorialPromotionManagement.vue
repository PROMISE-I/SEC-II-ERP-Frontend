<template>
  <Layout>
    <Title title="基于组合的促销策略"></Title>
    <el-button type="primary" size="medium" @click="dialogVisible = true">制定促销策略</el-button>
    <div class="body">
      <combinatorial-promotion-list :list="promotionList" @refresh="getData()"/>
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
          <el-form-item label="折让金额: " prop="discountAmount">
            <el-input v-model="promotionForm.discountAmount"></el-input>
          </el-form-item>
          <el-form-item label="商品1" prop="productOneId">
            <el-select v-model="promotionForm.productOneId" placeholder="请选择商品id" style="width: 40%; margin-right: 5%">
              <el-option
                  v-for="item1 in commodityList"
                  :key="item1.id"
                  :label="item1.id"
                  :value="item1.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品2" prop="productTwoId">
            <el-select v-model="promotionForm.productTwoId" placeholder="请选择商品id" style="width: 40%; margin-right: 5%">
              <el-option
                  v-for="item1 in commodityList"
                  :key="item1.id"
                  :label="item1.id"
                  :value="item1.id">
              </el-option>
            </el-select>
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
import CombinatorialPromotionList from "@/views/promotion/components/CombinatorialPromotionList";
import {getAllCommodity} from "@/network/commodity";
import {
  createCombinatorialPromotion,
  createTotalPricePromotion,
  getAllCombinatorialPromotion
} from "@/network/promotion";
import {formatDate} from "@/common/utils";
export default {
  name: "CombinatorialPromotionManagement",
  components: {
    Layout,
    Title,
    CombinatorialPromotionList
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
      promotionForm: {},
      rules: {
        date: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        discountAmount: [
          { required: true, message: '请输入折让金额', trigger: 'change' }
        ],
        productOneId: [
          { required: true, message: '请选择商品1', trigger: 'change' }
        ],
        productTwoId: [
          { required: true, message: '请选择商品2', trigger: 'change' }
        ]
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
      getAllCombinatorialPromotion({}).then(_res => {
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
          this.promotionForm.discountAmount = Number(this.promotionForm.discountAmount)
          this.promotionForm.productOneName = this.showName(this.promotionForm.productOneId)
          this.promotionForm.productTwoName = this.showName(this.promotionForm.productTwoId)
          this.promotionForm.beginDate = this.beginDate
          this.promotionForm.endDate = this.endDate
          console.log(this.promotionForm)
          createCombinatorialPromotion(this.promotionForm).then(_res => {
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
      this.promotionForm = {}
    },
    showName(id) {
      let ret = null
      for (let item in this.commodityList) {
        if (item.id === id) {
          ret = item.name
        }
      }
      return ret
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