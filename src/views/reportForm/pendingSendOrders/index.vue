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
      <el-table
        :data="list"
        border
        stripe
        size="medium"
        :height="tableHeight"
        :header-cell-style="headerStyle"
        :cell-style="cellStyle"
        :row-class-name="rowClassName"
      >
        <el-table-column type="index" label="序号" width="60" align="center" fixed></el-table-column>
        <el-table-column prop="poNo" label="订单号" min-width="120" align="center" show-overflow-tooltip fixed></el-table-column>
        <el-table-column prop="poSubNo" label="子订单号" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="itemNumber" label="产品编码" min-width="110" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="itemName" label="产品名称" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="departName" label="部件名称" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptQty" label="产品部件数量" width="110" align="center"></el-table-column>
        <el-table-column prop="receiveDate" label="接收时间" width="110" align="center"></el-table-column>
        <el-table-column prop="startDate" label="开工日期" width="110" align="center"></el-table-column>
        <el-table-column prop="warnningDays" label="预警天数" width="90" align="center"></el-table-column>
        <el-table-column prop="warnningRemainDays" label="预警剩余天数" width="110" align="center">
          <template slot-scope="scope">
            <span :class="{ 'warn-text': isWarn(scope.row) }">
              {{ scope.row.warnningRemainDays != null ? scope.row.warnningRemainDays : '—' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="收工序图片" width="100" align="center">
          <template slot-scope="scope">
            <template v-if="getPhotoList(scope.row).length">
              <el-image
                v-for="(url, index) in getPhotoList(scope.row)"
                :key="index"
                class="photo-thumb"
                :src="fileUrl + url"
                :preview-src-list="getPhotoList(scope.row).map(u => fileUrl + u)"
                fit="cover"
              />
            </template>
            <span v-else class="no-image">—</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import autoRefresh from '@/mixins/autoRefresh'
import { processNotSendBoardReportByPage } from '@/api/reportForm/index'

export default {
  name: 'PendingSendOrders',
  mixins: [autoRefresh],
  data() {
    return {
      loading: false,
      list: [],
      updateTime: '',
      tableHeight: 500,
      fileUrl: this.$store.state.user.url + '/images/'
    }
  },
  mounted() {
    this.calcTableHeight()
    window.addEventListener('resize', this.calcTableHeight)
    this.fetchData()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calcTableHeight)
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    calcTableHeight() {
      this.tableHeight = window.innerHeight - 100
    },
    headerStyle() {
      return {
        background: '#e2efda',
        color: '#303133',
        fontWeight: 'bold',
        textAlign: 'center'
      }
    },
    cellStyle() {
      return {
        background: '#f5faf2',
        textAlign: 'center'
      }
    },
    rowClassName({ row }) {
      return this.isWarn(row) ? 'warn-row' : ''
    },
    isWarn(row) {
      return row.warnningRemainDays != null && row.warnningRemainDays <= 0
    },
    getPhotoList(row) {
      if (row.recPhotoFiles && row.recPhotoFiles.length) {
        return row.recPhotoFiles.filter(u => u && String(u).trim())
      }
      if (row.recPhoto && String(row.recPhoto).trim()) {
        return [row.recPhoto]
      }
      return []
    },
    formatNow() {
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    },
    fetchData() {
      this.loading = true
      processNotSendBoardReportByPage(
        { pageNum: 1, pageSize: 500 },
        {}
      ).then(res => {
        this.loading = false
        if (res.flag && res.data) {
          this.list = res.data.records || []
        }
        this.updateTime = this.formatNow()
      }).catch(() => {
        this.loading = false
        this.updateTime = this.formatNow()
      })
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
  padding: 4px;
  overflow: auto;
}

.photo-thumb {
  width: 50px;
  height: 50px;
  margin: 2px;
}

.no-image {
  color: #c0c4cc;
}

.warn-text {
  color: #f56c6c;
  font-weight: 600;
}

::v-deep .warn-row td {
  background: #fef0f0 !important;
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
