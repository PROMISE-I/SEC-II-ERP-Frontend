<template>
  <Layout>
    <Title title="基于用户级别的促销策略"></Title>
    <div class="body">
      <level-promotion-list :list="promotionList" @refresh="getData()"/>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import LevelPromotionList from "@/views/promotion/components/LevelPromotionList";
import {formatDate} from "@/common/utils";
import {getAllLevelPromotion} from "@/network/promotion";

export default {
  name: "LevelPromotionManagement",
  components: {
    Layout,
    Title,
    LevelPromotionList
  },
  data() {
    return {
      promotionList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getAllLevelPromotion({}).then(_res => {
        this.promotionList = _res.result
        console.log(this.promotionList)
      })
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