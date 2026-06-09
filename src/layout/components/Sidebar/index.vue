<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        ref="menu"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        @select="closeMenuPopper"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLoginMode } from '@/utils/auth'
import { filterSidebarRoutes } from '@/utils/dynamicMenu'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  watch: {
    $route() {
      this.closeMenuPopper()
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return filterSidebarRoutes(this.$router.options.routes, getLoginMode())
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    closeMenuPopper() {
      this.$nextTick(() => {
        this.closeSubmenus(this.$refs.menu)
        this.hideBodyMenuPopper()
      })
    },
    closeSubmenus(component) {
      if (!component) return
      if (component.$options.name === 'ElSubmenu') {
        const closeFn = component._originalHandleMouseleave || component.handleMouseleave
        if (typeof closeFn === 'function') {
          closeFn()
        }
      }
      if (component.$children && component.$children.length) {
        component.$children.forEach(child => this.closeSubmenus(child))
      }
    },
    hideBodyMenuPopper() {
      document.querySelectorAll('body > .el-menu--popup').forEach(el => {
        el.style.display = 'none'
      })
    }
  }
}
</script>
