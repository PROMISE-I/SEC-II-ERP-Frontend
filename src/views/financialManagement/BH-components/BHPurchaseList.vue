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
          <el-col :span="3">
            <span><strong>供应商id: </strong>{{item.supplier}}</span>
          </el-col>
          <el-col :span="3">
            <span><strong>操作员: </strong>{{item.operator}}</span>
          </el-col>
          <el-col :span="6">
            <span><strong>总额合计: </strong>{{item.totalAmount}}(元)</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :span="24">
            <span><strong>备注: </strong>{{item.remark}}</span>
          </el-col>
        </el-row>
        <div v-if="showAll[index]" style="margin-top: 15px">
          <div style="margin-bottom: 15px"><strong>详细商品清单:</strong></div>
          <el-table
              :data="item.purchaseSheetContent"
              stripe
              style="width: 100%"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
            <el-table-column
                prop="pid"
                label="商品id"
                width="180">
            </el-table-column>
            <el-table-column
                prop="pid"
                label="商品id"
                width="180">
            </el-table-column>
            <el-table-column
                prop="quantity"
                label="数量"
                width="200">
            </el-table-column>
            <el-table-column
                prop="unitPrice"
                label="单价(元)"
                width="200">
            </el-table-column>
            <el-table-column
                prop="totalPrice"
                label="金额(元)"
                width="200">
            </el-table-column>
            <el-table-column
                prop="remark"
                label="备注">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-dialog
        title="创建进货单"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="purchaseForm" label-width="80px" ref="purchaseForm" :rules="rules">
          <el-form-item label="供应商: " prop="supplier">
            <el-select v-model="purchaseForm.supplier" placeholder="请选择供应商">
              <el-option
                  v-for="item in suppliers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
              v-for="(item, index) in purchaseForm.purchaseSheetContent"
              :key="index"
              :label="'商品' + index">
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
              <el-button type="text" size="small" @click="addProduct"
                         v-if="index === purchaseForm.purchaseSheetContent.length - 1">添加
              </el-button>
              <el-button type="text" size="small" @click.prevent="removeProduct(item)" v-if="index !== 0">删除</el-button>
            </div>
          </el-form-item>
          <el-form-item label="备注: ">
            <el-input type="textarea" v-model="purchaseForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('purchaseForm')">立即创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {getAllCommodity} from "@/network/commodity";
import {getAllCustomer} from "@/network/sale";
import {createPurchase} from "@/network/purchase";
import {deepCopy} from "@/common/utils";

export default {
  name: "BHPurchaseList",
  props: {
    list: Array,
  },
  data() {
    return {
      confirmVisible: false,
      showAll: [],
      dialogVisible: false,
      purchaseForm: {
        purchaseSheetContent: [
          {
            pid: '',
            quantity: '',
            unitPrice: '',
            remark: ''
          }
        ]
      },
      suppliers: [],
      rules: {
        supplier: [
          {required: true, message: '请选择一个供应商', trigger: 'change'}
        ],
      },
      commodityList: []
    }
  },
  mounted() {
    this.showAll = new Array(this.list.length).fill(false)
    getAllCommodity({}).then(_res => {
      let res = _res.result
      res.forEach(item => this.commodityList.push({ id: item.id }))
    })
    getAllCustomer({params: {type: 'SUPPLIER'}}).then(_res => {
      this.suppliers = _res.result
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let id = this.purchaseForm.id
          this.purchaseForm.id += '-1'
          this.purchaseForm.operator = sessionStorage.getItem("name")
          this.purchaseForm.totalAmount = this.purchaseForm.totalAmount
          this.purchaseForm.state = null
          this.purchaseForm.purchaseSheetContent.forEach((item) => {
            item.quantity = -parseInt(item.quantity)
            item.unitPrice = parseInt(item.unitPrice)
            item.totalPrice = item.quantity * item.unitPrice
          })
          createPurchase(this.purchaseForm).then(_res => {
            console.log(_res)
            if (_res.msg === 'Success') {
              this.$message.success('复制成功!')
              this.resetForm()
              this.dialogVisible = false
              this.$emit('refresh')
            }
          })
          this.reverseCreate(id)
        } else {
          this.$message.error('Error!');
        }
      });
    },
    reverseCreate(id) {
      // TODO：红冲功能
      let form = null
      this.list.forEach(item => {
        if (item.id === id) {
          form = deepCopy(item)
        }
      })
      console.log(form)
      for (let item of form.purchaseSheetContent) {
        item.quantity = -item.quantity
      }
      form.state = null
      form.finalAmount = null
      form.id = form.id + '-0'
      createPurchase(form).then(_res => {
        if (_res.msg === 'Success') {
          this.$message.success('红冲成功！')
          this.$emit('refresh')
        }
      })
    },
    reverseAndDuplicateCreate(id) {
      // TODO：红冲并复制
      let form = null
      this.list.forEach(item => {
        if (item.id === id) {
          form = deepCopy(item)
        }
      })
      this.purchaseForm = form
      this.dialogVisible = true
    },
    resetForm() {
      this.purchaseForm = {
        purchaseSheetContent: [
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
      this.purchaseForm.purchaseSheetContent.push({});
    },
    removeProduct(item) {
      let index = this.purchaseForm.purchaseSheetContent.indexOf(item)
      if (index !== -1) {
        this.purchaseForm.purchaseSheetContent.splice(index, 1)
      }
    },
    exportAsExcel() {
      // TODO ：导出 Excel 功能
      let curTime = new Date().getTime()
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '供应商id', '操作员', '总额合计', '备注']
        const filterVal = ['id', 'supplier', 'operator', 'totalAmount', 'remark']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        const filename = 'business-history-purchase' + curTime
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename,
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
      let contentList = []
      for (let item of this.list) {
        for (let content of item.purchaseSheetContent) {
          let tmp = content
          tmp.Outid = item.id
          contentList.push(tmp)
        }
      }
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '商品id', '数量', '单价', '备注']
        const filterVal = ['outId', 'pid', 'quantity', 'unitPrice', 'remark']
        const list = contentList
        const data = this.formatJson(filterVal, list)
        const filename = 'business-history-purchase-content' + curTime
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