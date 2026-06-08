<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
    </div>

    <div class="login-wrapper">
      <!-- 左侧品牌区 -->
      <div class="brand-panel">
        <div class="brand-content">
          <div class="brand-logo">
            <img src="@/assets/images/bg-logo.jpeg" alt="logo">
          </div>
          <h1 class="brand-title">后台管理系统</h1>
          <p class="brand-desc">工序管理 · 订单跟踪 · 数据报表</p>
          <ul class="brand-features">
            <li><i class="el-icon-check"></i> 全流程工序管控</li>
            <li><i class="el-icon-check"></i> 实时数据看板</li>
            <li><i class="el-icon-check"></i> 安全稳定的平台服务</li>
          </ul>
        </div>
      </div>

      <!-- 右侧登录区 -->
      <div class="form-panel">
        <div class="form-card">
          <div class="form-header">
            <h2>欢迎登录</h2>
            <p>请输入您的账号信息</p>
          </div>

          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            auto-complete="on"
            label-position="left"
          >
            <el-form-item prop="username">
              <label class="field-label">账号</label>
              <div class="input-wrap">
                <span class="input-icon">
                  <svg-icon icon-class="user"/>
                </span>
                <el-input
                  ref="username"
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                  name="username"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </div>
            </el-form-item>

            <el-form-item prop="password">
              <label class="field-label">密码</label>
              <div class="input-wrap">
                <span class="input-icon">
                  <svg-icon icon-class="password"/>
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="请输入密码"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
                </span>
              </div>
            </el-form-item>

            <div class="login-mode-section">
              <label class="field-label">登录模式</label>
              <div class="mode-cards">
                <div
                  class="mode-card"
                  :class="{ active: loginForm.loginMode === 'manage' }"
                  @click="loginForm.loginMode = 'manage'"
                >
                  <i class="el-icon-s-platform"></i>
                  <span class="mode-name">正常管理</span>
                  <span class="mode-desc">进入后台管理系统</span>
                </div>
                <div
                  class="mode-card"
                  :class="{ active: loginForm.loginMode === 'report' }"
                  @click="loginForm.loginMode = 'report'"
                >
                  <i class="el-icon-data-board"></i>
                  <span class="mode-name">报表看板</span>
                  <span class="mode-desc">大屏数据展示</span>
                </div>
              </div>
            </div>

            <el-button
              :loading="loading"
              type="primary"
              class="login-btn"
              @click.native.prevent="handleLogin"
            >
              {{ loading ? '登录中...' : '登 录' }}
            </el-button>
          </el-form>
        </div>

        <p class="copyright">© {{ currentYear }} 后台管理系统</p>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getLoginMode, setLoginMode } from '@/utils/auth'
import { resetDynamicMenu } from '@/utils/dynamicMenu'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback()
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于 6 位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        loginMode: getLoginMode()
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      currentYear: new Date().getFullYear()
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    const _this = this
    document.onkeypress = function(e) {
      const keycode = document.all ? event.keyCode : e.which
      if (keycode === 13) {
        _this.handleLogin()
        return false
      }
    }
  },
  methods: {
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(res => {
            if (res.flag) {
              setLoginMode(this.loginForm.loginMode)
              resetDynamicMenu()
              this.$router.push({ path: this.redirect || '/' })
            } else {
              this.$message({ message: res.msg, type: 'error' })
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 全局覆盖：登录页 input 样式 */
.login-page {
  .el-form-item {
    margin-bottom: 20px;
  }

  .el-form-item__error {
    padding-top: 4px;
  }

  .input-wrap {
    .el-input {
      width: 100%;

      input {
        height: 46px;
        line-height: 46px;
        padding: 0 40px 0 44px;
        background: #f5f7fa;
        border: 1px solid #e4e7ed;
        border-radius: 10px;
        color: #303133;
        font-size: 14px;
        transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;

        &::placeholder {
          color: #c0c4cc;
        }

        &:focus {
          background: #fff;
          border-color: #409eff;
          box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.12);
        }

        &:-webkit-autofill {
          box-shadow: 0 0 0 1000px #f5f7fa inset !important;
          -webkit-text-fill-color: #303133 !important;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #0f1724;
}

.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.45;
  }

  .shape-1 {
    width: 520px;
    height: 520px;
    background: #2563eb;
    top: -120px;
    left: -80px;
    animation: float 8s ease-in-out infinite;
  }

  .shape-2 {
    width: 400px;
    height: 400px;
    background: #7c3aed;
    bottom: -100px;
    right: 10%;
    animation: float 10s ease-in-out infinite reverse;
  }

  .shape-3 {
    width: 300px;
    height: 300px;
    background: #0891b2;
    top: 40%;
    right: -60px;
    animation: float 12s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-24px) scale(1.05); }
}

.login-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  width: 960px;
  max-width: calc(100vw - 48px);
  min-height: 560px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
}

/* 左侧品牌区 */
.brand-panel {
  flex: 1;
  background: linear-gradient(145deg, #1e3a5f 0%, #0f2744 100%);
  padding: 48px 40px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
}

.brand-content {
  position: relative;
  z-index: 1;
}

.brand-logo {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.15);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.brand-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
  letter-spacing: 1px;
}

.brand-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 36px;
  letter-spacing: 2px;
}

.brand-features {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255, 255, 255, 0.75);
    font-size: 14px;
    margin-bottom: 14px;

    i {
      color: #60a5fa;
      font-size: 16px;
    }
  }
}

/* 右侧表单区 */
.form-panel {
  flex: 1;
  background: #fff;
  padding: 48px 44px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  margin-bottom: 32px;

  h2 {
    font-size: 26px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0 0 8px;
  }

  p {
    font-size: 14px;
    color: #909399;
    margin: 0;
  }
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

.input-wrap {
  position: relative;

  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    color: #c0c4cc;
    font-size: 16px;
    line-height: 1;
    pointer-events: none;
  }

  .show-pwd {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    color: #c0c4cc;
    cursor: pointer;
    font-size: 16px;
    transition: color 0.2s;

    &:hover {
      color: #409eff;
    }
  }
}

.login-mode-section {
  margin-bottom: 28px;
}

.mode-cards {
  display: flex;
  gap: 12px;
}

.mode-card {
  flex: 1;
  padding: 14px 12px;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  background: #fafafa;

  i {
    display: block;
    font-size: 24px;
    color: #909399;
    margin-bottom: 6px;
    transition: color 0.2s;
  }

  .mode-name {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 2px;
  }

  .mode-desc {
    display: block;
    font-size: 11px;
    color: #c0c4cc;
  }

  &:hover {
    border-color: #b3d8ff;
    background: #ecf5ff;
  }

  &.active {
    border-color: #409eff;
    background: #ecf5ff;
    box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.12);

    i {
      color: #409eff;
    }

    .mode-name {
      color: #409eff;
    }
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 4px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #409eff 0%, #2563eb 100%);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.4);
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover, &:focus {
    background: linear-gradient(135deg, #66b1ff 0%, #3b82f6 100%);
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.5);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.copyright {
  text-align: center;
  font-size: 12px;
  color: #c0c4cc;
  margin: 24px 0 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
    width: 100%;
    max-width: 420px;
    min-height: auto;
  }

  .brand-panel {
    padding: 32px 28px;

    .brand-features {
      display: none;
    }
  }

  .form-panel {
    padding: 32px 28px 24px;
  }

  .brand-title {
    font-size: 22px;
  }
}
</style>
