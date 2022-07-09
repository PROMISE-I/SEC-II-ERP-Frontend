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
          <el-col :span="8">
            <span><strong>关联的进货单id: </strong>{{item.purchaseSheetId}}</span>
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
              :data="item.purchaseReturnsSheetContent"
              stripe
              style="width: 100%"
              :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
            <el-table-column
                prop="id"
                label="id"
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
        title="创建进货退货单"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
      <div style="width: 90%; margin: 0 auto">
        <el-form :model="purchaseReturnForm" label-width="100px" ref="purchaseReturnForm">
          <el-form-item label="进货单id: " prop="purchaseSheetId">
            <el-select v-model="purchaseReturnForm.purchaseSheetId"
                       placeholder="请选择关联的进货单id"
                       @change="selectPurchase(completedPurchase.filter(item => item.id === purchaseReturnForm.purchaseSheetId))">
              <el-option
                  v-for="(item, index) in completedPurchase"
                  :key="item.id"
                  :label="item.id"
                  :value="item.id">
                <el-popover
                    placement="right"
                    width="800"
                    trigger="hover">
                  <el-table :data="completedPurchase[index].purchaseSheetContent">
                    <el-table-column width="100" property="id" label="id"></el-table-column>
                    <el-table-column width="200" property="pid" label="pid"></el-table-column>
                    <el-table-column width="100" property="unitPrice" label="单价"></el-table-column>
                    <el-table-column width="100" property="quantity" label="数量"></el-table-column>
                    <el-table-column width="100" property="totalPrice" label="总价"></el-table-column>
                    <el-table-column property="remark" label="备注"></el-table-column>
                  </el-table>
                  <span slot="reference">{{ item.id }}</span>
                </el-popover>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="进货单清单: " v-if="this.purchaseReturnForm.purchaseReturnsSheetContent.length === 0">
            暂无数据!
          </el-form-item>
          <el-form-item label="进货单清单: " v-else>
            <div
                v-for="(item, index) in purchaseReturnForm.purchaseReturnsSheetContent"
                :key="index">
              <el-row>
                <el-col :span="8">
                  <span>id: {{item.pid}}</span>
                </el-col>
                <el-col :span="8">
                  数量: <el-input v-model="item.quantity" size="mini" style="width: 120px"></el-input>
                </el-col>
                <el-col :span="8">
                  单价: <el-input v-model="item.unitPrice" size="mini" style="width: 120px"></el-input>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <el-form-item label="备注: ">
            <el-input type="textarea" v-model="purchaseReturnForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('purchaseReturnForm')">立即创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {createPurchaseReturn, getAllPurchase} from "@/network/purchase";
import {deepCopy} from "@/common/utils";
import  {querySheetIdExist} from "@/network/financialManagement";

export default {
  name: "BHPurchaseReturnList",
  props: {
    list: Array,
  },
  data() {
    return {
      showAll: [],
      dialogVisible: false,
      purchaseReturnForm: {
        purchaseReturnsSheetContent: []
      },
      completedPurchase: []
    }
  },
  mounted() {
    this.showAll = new Array(this.list.length).fill(false)
    getAllPurchase({ params: { state: 'SUCCESS' } }).then(_res => {
      this.completedPurchase = _res.result
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
    selectPurchase(content) {
      this.purchaseReturnForm.purchaseReturnsSheetContent = content[0].purchaseSheetContent
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let id = this.purchaseReturnForm.id
          this.purchaseReturnForm.id += '-1'
          this.purchaseReturnForm.operator = sessionStorage.getItem("name")
          this.purchaseReturnForm.totalAmount = null
          this.purchaseReturnForm.purchaseReturnsSheetContent.forEach(item => {
            item.unitPrice = Number(item.unitPrice)
            item.quantity = Number(item.quantity)
            item.totalPrice = item.unitPrice * item.quantity
          })
          createPurchaseReturn(this.purchaseReturnForm).then(_res => {
            if (_res.msg == 'Success') {
              this.$message.success('复制成功!')
              this.dialogVisible = false
              this.purchaseReturnForm = {}
              this.purchaseReturnForm.purchaseReturnsSheetContent = []
              this.reverseCreate(id)
              this.$emit('refresh')
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
          this.$message.error('该单据已经使用了红冲功能！')
          return
        }
        let form = null
        this.list.forEach(item => {
          if (item.id === id) {
            form = deepCopy(item)
          }
        })
        console.log(form)
        for (let item of form.purchaseReturnsSheetContent) {
          item.quantity = -item.quantity
        }
        form.state = null
        form.finalAmount = null
        form.id += '-0'
        createPurchaseReturn(form).then(_res => {
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
          this.$message.error('该单据已经使用了红冲功能！')
          return
        }
        let form = null
        this.list.forEach(item => {
          if (item.id === id) {
            form = deepCopy(item)
          }
        })
        this.purchaseReturnForm = form
        this.dialogVisible = true
      })
    },
    exportAsExcel() {
      // TODO ：导出 Excel 功能
      let curTime = new Date().getTime()
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '关联的进货单id', '操作员', '总额合计', '备注']
        const filterVal = ['id', 'purchaseSheetId', 'operator', 'totalAmount', 'remark']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        const filename = 'business-history-purchase-returns' + curTime
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
        for (let content of item.purchaseReturnsSheetContent) {
          let tmp = content
          tmp.outId = item.id
          contentList.push(tmp)
        }
      }
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '商品id', '数量', '单价', '备注']
        const filterVal = ['outId', 'pid', 'quantity', 'unitPrice', 'remark']
        const list = contentList
        const data = this.formatJson(filterVal, list)
        const filename = 'business-history-purchase-returns-content' + curTime
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