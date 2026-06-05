export default {
  data() {
    return {
      refreshTimer: null,
      countdownTimer: null,
      refreshCountdown: 30,
      refreshInterval: 30
    }
  },
  mounted() {
    this.startAutoRefresh()
  },
  beforeDestroy() {
    this.stopAutoRefresh()
  },
  methods: {
    startAutoRefresh() {
      this.refreshCountdown = this.refreshInterval
      this.countdownTimer = setInterval(() => {
        this.refreshCountdown--
        if (this.refreshCountdown <= 0) {
          this.refreshCountdown = this.refreshInterval
        }
      }, 1000)
      this.refreshTimer = setInterval(() => {
        if (typeof this.fetchData === 'function') {
          this.fetchData()
        }
        this.refreshCountdown = this.refreshInterval
      }, this.refreshInterval * 1000)
    },
    stopAutoRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer)
        this.refreshTimer = null
      }
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
    }
  }
}
