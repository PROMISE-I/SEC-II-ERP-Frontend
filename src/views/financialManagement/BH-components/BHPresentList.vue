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
          <el-col :span="12">
            <span><strong>所属销售单id: </strong>{{item.saleSheetId}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :span="6">
            <span><strong>赠送商品总额: </strong>{{item.totalAmount}}(元)</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :span="24">
            <span><strong>备注: </strong>{{item.remark}}</span>
          </el-col>
        </el-row>
        <div v-if="showAll[index]" style="margin-top: 15px">
          <div style="margin-bottom: 15px"><strong>详细赠品清单:</strong></div>
          <el-table
              :data="item.contentVOList"
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
                label="总价(元)"
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
  </div>
</template>

<script>
import {deepCopy} from "@/common/utils";
import {querySheetIdExist} from "@/network/financialManagement";
import {createGiveAway} from "@/network/sale";
export default {
  name: "BHPresentList",
  props: {
    list: Array,
  },
  data() {
    return {
      showAll: [],
    }
  },
  mounted() {
    this.showAll = new Array(this.list.length).fill(false)
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
    reverseCreate(id) {
      // 红冲功能
      const config = {
        params: {
          sheetId: id + '-0'
        }
      }
      querySheetIdExist(config).then(_res => {
        console.log(_res.result)
        if (_res.result === true) {
          this.$message.error('该单据已经使用过红冲功能！')
          return
        }
        let form = null
        this.list.forEach(item => {
          if (id == item.id) {
            form = deepCopy(item)
          }
        })
        for (let item of form.saleSheetContent) {
          item.quantity = -item.quantity
        }
        form.state = null
        form.finalAmount = null
        form.id += '-0'
        console.log(form)
        createSale(form).then(_res => {
          if (_res.msg === 'Success') {
            this.$message.success('红冲成功！')
            this.$emit('refresh')
          }
        })
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          createGiveAway(this.saleForm).then(_res => {
            if (_res.msg === 'Success') {
              this.$message.success('复制成功!')
              this.dialogVisible = false
              this.$emit('refresh')
            }
          })
          this.reverseCreate(id)
        }
      })
    },
    reverseAndDuplicateCreate(id) {
      // 红冲并复制
      const config = {
        params: {
          sheetId: id + '-0'
        }
      }
      querySheetIdExist(config).then(_res => {
        if (_res.result === true) {
          this.$message.error('该单据已经使用过红冲功能！')
          return
        }
        let form = null
        this.list.forEach(item => {
          if (item.id === id) {
            form = deepCopy(item)
          }
        })
        this.saleForm = form
        this.dialogVisible = true
      })
    },
    exportAsExcel() {
      // 导出 Excel 功能
      let curTime = new Date().getTime()
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '供应商id', '业务员', '操作员', '折让前总额', '折扣', '使用代金券总和', '折让后总额', '备注']
        const filterVal = ['id', 'supplier', 'salesman', 'operator', 'rawTotalAmount', 'discount', 'voucherAmount', 'totalAmount', 'remark']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        const filename = 'business-history-sale' + curTime
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
        for (let content of item.saleSheetContent) {
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
        const filename = 'business-history-sale-content' + curTime
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