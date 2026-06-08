<template>
  <div class="dashboard-page" v-loading="loading">
    <div class="dashboard-header">
      <div class="header-left">
        <el-button type="text" icon="el-icon-arrow-left" class="back-btn" @click="goBack">返回</el-button>
        <h1>领导看板</h1>
      </div>
      <div class="header-right">
        <span class="refresh-tip">{{ refreshCountdown }} 秒后自动刷新</span>
        <span class="update-time" v-if="updateTime">更新时间：{{ updateTime }}</span>
      </div>
    </div>

    <div class="chart-container" ref="chartRef"></div>

    <div class="table-section">
      <table class="board-table">
        <thead>
          <tr>
            <th class="dept-col">部门</th>
            <th>本周各部门交出去的累计订单数<br><span class="sub">（部门交工序的数量）</span></th>
            <th>本月各部门交出去的累计订单数<br><span class="sub">（部门交工序的数量）</span></th>
            <th>今年各部门交出去的累计订单数<br><span class="sub">（部门交工序的数量）</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index">
            <td class="dept-col">{{ row.deptName }}</td>
            <td>{{ row.weekCount }}</td>
            <td>{{ row.monthCount }}</td>
            <td>{{ row.yearCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import autoRefresh from '@/mixins/autoRefresh'
import { leaderBoardReport } from '@/api/reportForm/index'

const DEFAULT_DEPTS = [
  { deptName: '备料车间', shortName: '备料', weekCount: 0, monthCount: 0, yearCount: 0 },
  { deptName: '木工车间', shortName: '木工', weekCount: 0, monthCount: 0, yearCount: 0 },
  { deptName: '粗磨车间', shortName: '粗磨', weekCount: 0, monthCount: 0, yearCount: 0 },
  { deptName: '晒板车间', shortName: '晒板', weekCount: 0, monthCount: 0, yearCount: 0 },
  { deptName: '细磨、蜡油车间', shortName: '细磨、蜡油', weekCount: 0, monthCount: 0, yearCount: 0 },
  { deptName: '细磨、上漆车间', shortName: '细磨、上漆', weekCount: 0, monthCount: 0, yearCount: 0 },
  { deptName: '总装车间（收工序数量）', shortName: '总装', weekCount: 0, monthCount: 0, yearCount: 0 }
]

export default {
  name: 'LeaderDashboard',
  mixins: [autoRefresh],
  data() {
    return {
      loading: false,
      chart: null,
      tableData: DEFAULT_DEPTS.map(item => ({ ...item })),
      updateTime: ''
    }
  },
  mounted() {
    this.fetchData()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    normalizeData(list) {
      if (!Array.isArray(list) || list.length === 0) {
        return DEFAULT_DEPTS.map(item => ({ ...item }))
      }
      return DEFAULT_DEPTS.map(defaultDept => {
        const matched = list.find(item => {
          const name = item.deptName || item.shortName || ''
          return name.includes(defaultDept.shortName) || defaultDept.deptName.includes(name)
        })
        if (!matched) {
          return { ...defaultDept }
        }
        return {
          deptName: matched.deptName || defaultDept.deptName,
          shortName: matched.shortName || defaultDept.shortName,
          weekCount: matched.weekCount != null ? matched.weekCount : (matched.weekQty || 0),
          monthCount: matched.monthCount != null ? matched.monthCount : (matched.monthQty || 0),
          yearCount: matched.yearCount != null ? matched.yearCount : (matched.yearQty || 0)
        }
      })
    },
    fetchData() {
      this.loading = true
      leaderBoardReport().then(res => {
        this.loading = false
        if (res.flag) {
          this.tableData = this.normalizeData(res.data)
        }
        this.updateTime = this.formatNow()
        this.renderChart()
      }).catch(() => {
        this.loading = false
        this.updateTime = this.formatNow()
        this.renderChart()
      })
    },
    formatNow() {
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    },
    renderChart() {
      if (!this.$refs.chartRef) return
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chartRef)
      }
      const categories = this.tableData.map(item => item.shortName)
      const weekData = this.tableData.map(item => item.weekCount)
      const monthData = this.tableData.map(item => item.monthCount)
      const yearData = this.tableData.map(item => item.yearCount)

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: ['本周', '本月', '今年'],
          top: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 60,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: {
            interval: 0,
            rotate: categories.length > 5 ? 20 : 0
          }
        },
        yAxis: {
          type: 'value',
          name: '数量',
          minInterval: 1
        },
        series: [
          {
            name: '本周',
            type: 'bar',
            data: weekData,
            itemStyle: { color: '#5470c6' },
            barMaxWidth: 40
          },
          {
            name: '本月',
            type: 'bar',
            data: monthData,
            itemStyle: { color: '#91cc75' },
            barMaxWidth: 40
          },
          {
            name: '今年',
            type: 'bar',
            data: yearData,
            itemStyle: { color: '#fac858' },
            barMaxWidth: 40
          }
        ]
      }, true)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 16px 24px 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h1 {
    margin: 0;
    font-size: 24px;
    color: #303133;
  }

  .back-btn {
    font-size: 14px;
    color: #606266;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 13px;
    color: #909399;
  }
}

.chart-container {
  height: 420px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

.table-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: auto;
}

.board-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th, td {
    border: 1px solid #dcdfe6;
    padding: 12px 16px;
    text-align: center;
    vertical-align: middle;
  }

  thead th {
    background: #e2efda;
    color: #303133;
    font-weight: bold;
    line-height: 1.5;

    .sub {
      font-weight: normal;
      font-size: 12px;
      color: #606266;
    }
  }

  tbody td {
    background: #f5faf2;
  }

  .dept-col {
    min-width: 160px;
    font-weight: 500;
    text-align: left;
    background: #e2efda !important;
  }
}
</style>
