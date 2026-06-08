import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken,
  getLoginMode,
  getMenuType
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { addRouter } from './utils/addRouter'// 格式化菜单data
import { getRouter } from '@/api/menu'// 格式化菜单data
import {
  getHasMenu,
  setHasMenu,
  getLoadedMenuType,
  setLoadedMenuType,
  resetDynamicMenu,
  resolveTargetPath
} from '@/utils/dynamicMenu'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar 加载进度条
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken('wcrx')
  if (typeof(hasToken)!='undefined') {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const menuType = getMenuType()
      if (getHasMenu() && getLoadedMenuType() !== menuType) {
        resetDynamicMenu()
      }
      if (getHasMenu()) {
        const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          next()
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
      } else {
        gotoRouter(to, next)
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

function gotoRouter(to, next) {
  const menuType = getMenuType()
  getRouter(menuType)
    .then(res => {
      res.data.map(val => {
        val.type = 1
        val.children.map(value => {
          if(value.children!=null && value.children!=''){
            value.type = 2
          }
        })
      })
      console.log(res.data)
      const asyncRouter = addRouter(res.data)
      console.log(asyncRouter)
      asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
      return asyncRouter
    })
    .then(asyncRouter => {
      router.addRoutes(asyncRouter)
      for(var i = 0;i<asyncRouter.length;i++){
        router.options.routes[3+i] = asyncRouter[i]
      }
      setHasMenu(true)
      setLoadedMenuType(menuType)
      store.dispatch('menu/setRouterList', asyncRouter)

      const targetPath = resolveTargetPath(
        to.path,
        asyncRouter,
        router.options.routes,
        getLoginMode()
      )

      store.dispatch('permission/generateRoutes', router.options.routes)
      next({ path: targetPath, query: to.query, hash: to.hash, replace: true })
    })
    .catch(e => {
      store.dispatch('user/resetToken')
    })
}

export { resetDynamicMenu }
