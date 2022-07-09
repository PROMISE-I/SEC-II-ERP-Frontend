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
          <el-col :span="6">
            <span><strong>折让金额: </strong>{{item.discountAmount}}(元)</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span><strong>商品1 id: </strong>{{item.productOneId}}</span>
          </el-col>
          <el-col :span="8">
            <span><strong>商品1 名称: </strong>{{item.productOneName}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span><strong>商品2 id: </strong>{{item.productTwoId}}</span>
          </el-col>
          <el-col :span="8">
            <span><strong>商品2 名称: </strong>{{item.productTwoName}}</span>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import {formatDate} from "@/common/utils";
import {deleteCombinatorialPromotion, deleteTotalPricePromotion} from "@/network/promotion"
export default {
  name: "CombinatorialPromotionList",
  props: {
    list: Array
  },
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {
    deletePromotion(id) {
      const config = {
        params: {
          id : id
        }
      }
      console.log(config)
      deleteCombinatorialPromotion(config).then(_res => {
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