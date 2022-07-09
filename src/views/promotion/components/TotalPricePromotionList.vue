<template>
  <div class="card">
    <el-card v-for="(item, index) in list" :index="item.index" :key="item.id" shadow="hover">
      <template #header>
        <el-row>
          <el-col :span="18">
            <span><strong>id: </strong>{{item.id}}</span>
            <el-popconfirm
                title="确定要删除吗？"
                @confirm="deletePromotion(item.id)"
            >
              <el-button style="margin-left: 10px"
                         type="danger" size="mini" slot="reference">
                删除
              </el-button>
            </el-popconfirm>
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
            <span><strong>开始时间: </strong>{{formatDate(item.beginTimeStr)}}</span>
          </el-col>
          <el-col :span="8">
            <span><strong>结束时间: </strong>{{formatDate(item.endTimeStr)}}</span>
          </el-col>
          <el-col :span="6">
            <span><strong>生效阈值: </strong>{{item.threshold}}(元)</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :span="3">
            <span><strong>操作员 </strong>{{item.operator}}</span>
          </el-col>
          <el-col :span="6">
            <span><strong>优惠券金额 </strong>{{item.voucherAmount}}(元)</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :span="24">
            <span><strong>备注: </strong>{{item.remark}}</span>
          </el-col>
        </el-row>
        <div v-if="showAll[index]" style="margin-top: 15px">
          <div style="margin-bottom: 15px"><strong>赠品清单:</strong></div>
          <el-table
              :data="item.contentList"
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
import {deleteTotalPricePromotion} from "@/network/promotion";
import {formatDate} from "@/common/utils";

export default {
  name: "TotalPricePromotionList",
  props: {
    list: Array
  },
  data() {
    return {
      showAll: []
    }
  },
  mounted() {
    this.showAll = new Array(this.list.length).fill(false)
  },
  methods: {
    changeState(index) {
      this.$set(this.showAll, index, !this.showAll[index])
    },
    deletePromotion(id) {
      const config = {
        params: {
          id : id
        }
      }
      console.log(config)
      deleteTotalPricePromotion(config).then(_res => {
        if (_res.msg === 'Success') {
          this.$message.success('删除成功！')
          this.$emit('refresh')
        }
      })
    },
    formatDate
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