<template>
  <Layout>
    <Title title="打卡"></Title>
    <el-button type="primary" size="medium" @click="clockInToday()">今日打卡</el-button>
    <br><br>
    <el-calendar v-model="value">
      <!-- copied from https://element.eleme.cn/#/zh-CN/component/calendar -->
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template
          slot="dateCell"
          slot-scope="{date, data}">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-').slice(1).join('-') }} {{ isChecked(data) ? '✔️' : '' }}
        </p>
      </template>
    </el-calendar>
  </Layout>
</template>

<script>
import Layout from "@/components/content/Layout";
import Title from "@/components/content/Title";
import {oneTick} from "@/common/utils";
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
      value: new Date(),
      attendanceDetail: []
    }
  },
  watch: {
    value: function (val, oldVal) {
      const month = val.getMonth()
      const year = val.getFullYear()
      this.getAttendanceDetail(year, month)
    }
  },
  async mounted() {
    await this.getAttendanceDetail(this.value.getFullYear(), this.value.getMonth())
  },
  methods: {
    getDayCountOfMonth(year, month) {
      return new Date(year, month, 0).getDate()
    },
    async getAttendanceDetail(year, month) {
      const staffId = parseInt(sessionStorage.getItem("staffId"))
      const dayCount = this.getDayCountOfMonth(year, month)
      this.attendanceDetail = []
      for (let i = 1; i <= dayCount; i++) {
        let theDay = this.getDateStr(new Date(year, month, i))
        const attendanceRecordVO = {
          staffId: staffId,
          date: theDay
        }
        await check(attendanceRecordVO).then(_res => {
          this.attendanceDetail.push({day: i, attendanceInfo : _res.result})
        })
      }
      // console.log(year, month + 1, this.attendanceDetail)
    },
    getDateStr(date) {
      let ret = String(date.getFullYear())
      while (ret.length < 4) {
        ret = '0' + ret
      }
      ret += '-'
      let cur = String(date.getMonth() + 1)
      while (cur.length < 2) {
        cur = '0' + cur
      }
      ret += cur + '-'
      cur = String(date.getDate())
      while (cur.length < 2) {
        cur = '0' + cur
      }
      ret += cur
      return ret
    },
    clockInToday() {
      const date = new Date()
      const today = this.getDateStr(date)
      const staffId = parseInt(sessionStorage.getItem("staffId"))
      const attendanceRecordVO = {
        staffId: staffId,
        date: today
      }
      // console.log({ day: this.getDateStr(date) })
      if (this.isChecked({ day: this.getDateStr(date) })) {
        this.$message.info('今天已经打过卡了，明天再来吧~')
      } else {
        clockIn(attendanceRecordVO).then(_res => {
          this.$message.success('打卡成功！')
          location.reload()
        })
      }
    },
    isChecked(data) {
      if (parseInt(data.day.split('-')[1]) != this.value.getMonth() + 1) return false
      let ret = false, targetDay = parseInt(data.day.split('-')[2])
      this.attendanceDetail.forEach(item => {
        if (item.day === targetDay && item.attendanceInfo === true) {
          ret = true
        }
      })
      return ret
    }
  }
}
</script>

<style scoped>
.is-selected {
  color: #1989FA;
}
</style>