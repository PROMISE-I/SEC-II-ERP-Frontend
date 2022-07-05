<template>
  <Layout>
    <Title title="打卡"></Title>
    <el-button type="primary" size="medium" @click="dialogVisible = true" @disabled="disabled = false">今日打卡</el-button>
    <br><br>
    <el-calendar>
      <!-- copied from https://element.eleme.cn/#/zh-CN/component/calendar -->
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template
          slot="dateCell"
          slot-scope="{date, data}">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
        </p>
      </template>
    </el-calendar>
  </Layout>
</template>

<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import {
  check,
  clockIn
} from "@/network/attendance";

export default {
  name: "Attendance",
  components: {
    Layout,
    Title
  },
  data() {
    return {
      disabled: false,
      dialogVisible: false,
    }
  },
  async mounted() {
    // in params: staff = ?,
    await clockIn({ params : {} }).then(_res => {
      // TODO: 修了这个 disabled 的 API 之后把这个完成了
    })
  },
  methods: {
    // TODO: 完成日历的部分，看看会不会卡
  }
}
</script>

<style scoped>

</style>