<template>
  <div class="dashboard-page" v-loading="loading">
    <div class="dashboard-header">
      <div class="header-left">
        <el-button type="text" icon="el-icon-arrow-left" class="back-btn" @click="goBack">返回</el-button>
        <h1>收工序后还未交出去的订单</h1>
      </div>
      <div class="header-right">
        <span class="refresh-tip">{{ refreshCountdown }} 秒后自动刷新</span>
        <span class="update-time" v-if="updateTime">更新时间：{{ updateTime }}</span>
      </div>
    </div>

    <div class="table-section">
      <list
        class="list-main"
        :columns="columns"
        :loading="loading"
        :list="list"
        index
        :highlight="false"
        @handle-size="handleSize"
        @handle-current="handleCurrent"
      />
    </div>
  </div>
</template>

<script>
import autoRefresh from '@/mixins/autoRefresh'
import List from '@/components/List'
import { processNotSendBoardReportByPage } from '@/api/reportForm/index'

export default {
  name: 'PendingSendOrders',
  components: { List },
  mixins: [autoRefresh],
  data() {
    return {
      loading: false,
      list: {},
      updateTime: '',
      columns: [
        { text: '订单号', name: 'poNo', width: '120px' },
        { text: '子订单号', name: 'poSubNo', width: '120px' },
        { text: '产品编码', name: 'itemNumber', width: '110px' },
        { text: '产品名称', name: 'itemName', width: '120px' },
        { text: '部件名称', name: 'departName', width: '120px' },
        { text: '产品部件数量', name: 'deptQty', width: '110px' },
        { text: '接收时间', name: 'receiveDate', width: '110px' },
        { text: '开工日期', name: 'startDate', width: '110px' },
        { text: '预警天数', name: 'warnningDays', width: '90px' },
        { text: '预警剩余天数', name: 'warnningRemainDays', width: '110px' },
        { text: '收工序图片', name: 'recPhotoFiles', default: 'images', width: '100px' }
      ]
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    handleSize(val) {
      this.list.size = val
      this.fetchData()
    },
    handleCurrent(val) {
      this.list.current = val
      this.fetchData()
    },
    formatNow() {
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    },
    fetchData(val = {}, data = {
      pageNum: this.list.current || 1,
      pageSize: this.list.size || 50
    }) {
      this.loading = true
      processNotSendBoardReportByPage(data, val).then(res => {
        this.loading = false
        if (res.flag) {
          this.list = res.data || {}
          if (this.list.records) {
            this.list.records = this.list.records.map(row => ({
              ...row,
              recPhotoFiles: this.normalizePhotos(row)
            }))
          }
        }
        this.updateTime = this.formatNow()
      }).catch(() => {
        this.loading = false
        this.updateTime = this.formatNow()
      })
    },
    normalizePhotos(row) {
      if (row.recPhotoFiles && row.recPhotoFiles.length) {
        return row.recPhotoFiles.filter(u => u && String(u).trim())
      }
      if (row.recPhoto && String(row.recPhoto).trim()) {
        return [row.recPhoto]
      }
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 12px 16px 16px;
  box-sizing: border-box;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
  }

  h1 {
    margin: 0;
    font-size: clamp(16px, 4vw, 22px);
    color: #303133;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .back-btn {
    font-size: 14px;
    color: #606266;
    flex-shrink: 0;
  }

  .header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 12px;
    color: #909399;
    flex-shrink: 0;
  }
}

.table-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 8px;
}

.list-main {
  width: 100%;

  ::v-deep .el-table {
    height: auto !important;
  }

  ::v-deep .el-table__body-wrapper {
    height: auto !important;
    max-height: none !important;
  }

  ::v-deep .el-table__fixed,
  ::v-deep .el-table__fixed-right {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 8px 8px 12px;
  }

  .dashboard-header h1 {
    max-width: 200px;
  }
}
</style>
