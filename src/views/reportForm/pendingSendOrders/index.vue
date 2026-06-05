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
        height="calc(100vh - 120px)"
        :header-cell-style="headerStyle"
        :cell-style="cellStyle"
      >
        <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
        <el-table-column prop="subPoNo" label="子订单号" min-width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.subPoNo || scope.row.poSubNo || '' }}
          </template>
        </el-table-column>
        <el-table-column prop="itemName" label="产品部件" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.itemName || scope.row.departName || '' }}
          </template>
        </el-table-column>
        <el-table-column prop="itemQty" label="产品部件数量" width="130" align="center">
          <template slot-scope="scope">
            {{ scope.row.itemQty != null ? scope.row.itemQty : (scope.row.receiveQty || scope.row.prodQty || '') }}
          </template>
        </el-table-column>
        <el-table-column prop="receiveDate" label="接收时间（即收工序时间）" width="180" align="center"></el-table-column>
        <el-table-column prop="startDate" label="开工时间" width="160" align="center"></el-table-column>
        <el-table-column label="收工序图片" width="120" align="center">
          <template slot-scope="scope">
            <template v-if="getPhotoList(scope.row).length">
              <el-image
                v-for="(url, index) in getPhotoList(scope.row)"
                :key="index"
                style="width: 60px; height: 60px; margin: 2px;"
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
import { pendingSendReportByPage } from '@/api/reportForm/index'

export default {
  name: 'PendingSendOrders',
  mixins: [autoRefresh],
  data() {
    return {
      loading: false,
      list: [],
      updateTime: '',
      fileUrl: this.$store.state.user.url + '/images/'
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    goBack() {
      this.$router.push('/reportBoardPortal')
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
    getPhotoList(row) {
      const photos = row.recPhotoFiles || row.photoFiles
      if (!photos) return []
      if (Array.isArray(photos)) {
        return photos.filter(u => u && String(u).trim())
      }
      return String(photos).trim() ? [photos] : []
    },
    formatNow() {
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    },
    fetchData() {
      this.loading = true
      pendingSendReportByPage({ pageNum: 1, pageSize: 500 }, {}).then(res => {
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
    font-size: 22px;
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

.table-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 8px;
}

.no-image {
  color: #c0c4cc;
}
</style>
