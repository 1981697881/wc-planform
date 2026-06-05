<template>
  <div class="report-board-portal">
    <div class="portal-header">
      <h1>报表看板</h1>
      <div class="portal-actions">
        <span class="user-name">{{ displayName }}</span>
        <el-button size="mini" type="text" @click="goManage">进入管理后台</el-button>
        <el-button size="mini" type="text" @click="handleLogout">退出登录</el-button>
      </div>
    </div>
    <div class="portal-cards">
      <div
        v-for="item in reportList"
        :key="item.path"
        class="report-card"
        @click="openReport(item.path)"
      >
        <i :class="item.icon"></i>
        <h2>{{ item.title }}</h2>
        <p>{{ item.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'

export default {
  name: 'ReportBoardPortal',
  computed: {
    ...mapGetters(['name']),
    displayName() {
      return this.name || Cookies.get('wcun') || ''
    }
  },
  data() {
    return {
      reportList: [
        {
          title: '领导看板',
          desc: '各部门本周/本月/今年交工序累计数量',
          path: '/reportBoard/leaderDashboard',
          icon: 'el-icon-data-analysis'
        },
        {
          title: '收工序后还未交出去的订单',
          desc: '已接收工序但尚未交付的订单明细',
          path: '/reportBoard/pendingSendOrders',
          icon: 'el-icon-document'
        }
      ]
    }
  },
  methods: {
    openReport(path) {
      this.$router.push(path)
    },
    goManage() {
      this.$router.push('/dashboard')
    },
    async handleLogout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.report-board-portal {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a3a 0%, #2d4a5e 100%);
  padding: 40px;
}

.portal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;

  h1 {
    color: #fff;
    font-size: 32px;
    margin: 0;
  }
}

.portal-actions {
  display: flex;
  align-items: center;
  gap: 12px;

  .user-name {
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
  }

  .el-button {
    color: rgba(255, 255, 255, 0.75);

    &:hover {
      color: #fff;
    }
  }
}

.portal-cards {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
}

.report-card {
  width: 380px;
  padding: 48px 32px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  }

  i {
    font-size: 56px;
    color: #409eff;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 22px;
    color: #303133;
    margin: 0 0 12px;
  }

  p {
    font-size: 14px;
    color: #909399;
    margin: 0;
    line-height: 1.6;
  }
}
</style>
