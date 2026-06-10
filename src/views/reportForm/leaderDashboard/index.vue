<template>
  <div class="leader-board" v-loading="loading">
    <div class="board-bg"></div>

    <div class="board-header">
      <div class="header-meta">
        <span class="refresh-tip">{{ refreshCountdown }}s 刷新</span>
        <span v-if="updateTime" class="update-time">{{ updateTime }}</span>
      </div>
    </div>

    <div class="board-title">制造中心</div>

    <div class="card-list">
      <div
        v-for="(item, index) in list"
        :key="item.processNumber || index"
        class="process-card"
      >
        <div class="card-left">
          <div class="process-name">{{ item.processName || '—' }}</div>
          <div class="process-main">
            <span class="main-label">周数量</span>
            <span class="main-value">{{ item.weekSendQty != null ? item.weekSendQty : '0' }}</span>
          </div>
        </div>
        <div class="card-right">
          <div class="avatar-icon">
            <i class="el-icon-user-solid"></i>
          </div>
          <div class="qty-list">
            <div class="qty-row">
              <span class="qty-label">周数量：</span>
              <span class="qty-value">{{ item.weekSendQty != null ? item.weekSendQty : '0' }}</span>
            </div>
            <div class="qty-row">
              <span class="qty-label">月数量：</span>
              <span class="qty-value">{{ item.monthSendQty != null ? item.monthSendQty : '0' }}</span>
            </div>
            <div class="qty-row">
              <span class="qty-label">年数量：</span>
              <span class="qty-value">{{ item.yearSendQty != null ? item.yearSendQty : '0' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && list.length === 0" class="empty-tip">暂无数据</div>
    </div>
  </div>
</template>

<script>
import autoRefresh from '@/mixins/autoRefresh'
import { processLeadBoardReportByPage } from '@/api/reportForm/index'

export default {
  name: 'LeaderDashboard',
  mixins: [autoRefresh],
  data() {
    return {
      loading: false,
      list: [],
      updateTime: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    formatNow() {
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    },
    fetchData() {
      this.loading = true
      processLeadBoardReportByPage(
        { pageNum: 1, pageSize: 100 },
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
.leader-board {
  position: relative;
  min-height: 100vh;
  padding: 12px 16px 24px;
  overflow: hidden;
  box-sizing: border-box;
}

.board-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: linear-gradient(160deg, #0a2463 0%, #1e3a8a 45%, #0f172a 100%);

  &::after {
    content: '';
    position: absolute;
    right: -10%;
    bottom: -15%;
    width: 70%;
    height: 70%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
}

.board-header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 8px;

  .header-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.55);
  }
}

.board-title {
  position: relative;
  z-index: 1;
  text-align: right;
  font-size: clamp(28px, 6vw, 42px);
  font-weight: 700;
  color: #fff;
  letter-spacing: 4px;
  margin-bottom: 16px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.card-list {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
}

.process-card {
  display: flex;
  align-items: stretch;
  min-height: 120px;
  padding: 16px 18px;
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(30, 64, 120, 0.92) 0%, rgba(15, 40, 90, 0.88) 100%);
  border: 1px solid rgba(100, 160, 255, 0.25);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.card-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 12px;
  border-right: 1px solid rgba(255, 255, 255, 0.12);

  .process-name {
    font-size: clamp(18px, 4vw, 24px);
    font-weight: 600;
    color: #f4a261;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .process-main {
    display: flex;
    align-items: baseline;
    gap: 8px;

    .main-label {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
    }

    .main-value {
      font-size: clamp(36px, 8vw, 52px);
      font-weight: 700;
      color: #fff;
      line-height: 1;
    }
  }
}

.card-right {
  flex: 1.2;
  display: flex;
  align-items: center;
  padding-left: 14px;
  gap: 12px;

  .avatar-icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 28px;
      color: rgba(255, 255, 255, 0.85);
    }
  }

  .qty-list {
    flex: 1;
    min-width: 0;
  }

  .qty-row {
    display: flex;
    align-items: center;
    line-height: 1.8;
    font-size: clamp(13px, 3.2vw, 15px);
  }

  .qty-label {
    color: #f4a261;
    white-space: nowrap;
  }

  .qty-value {
    color: #fff;
    font-weight: 600;
  }
}

.empty-tip {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

@media (max-width: 480px) {
  .leader-board {
    padding: 10px 12px 20px;
  }

  .card-list {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .process-card {
    min-height: 110px;
    padding: 14px;
  }

  .card-left {
    .process-main .main-value {
      font-size: 40px;
    }
  }

  .card-right {
    .avatar-icon {
      width: 40px;
      height: 40px;

      i {
        font-size: 22px;
      }
    }
  }

  .board-title {
    font-size: 26px;
    margin-bottom: 12px;
  }
}
</style>
