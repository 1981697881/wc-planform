import _router from '../router/router' // 获取组件的方法

const DEFAULT_MENU_ICONS = {
  reportBoard: 'chart',
  leaderDashboard: 'chart',
  pendingSendOrders: 'list'
}

function resolveMenuIcon(e) {
  const icon = e.cuicon || e.icon || e.menuIcon || ''
  if (icon) return icon
  if (e.id && DEFAULT_MENU_ICONS[e.id]) {
    return DEFAULT_MENU_ICONS[e.id]
  }
  if (Number(e.type) === 1) {
    return 'nested'
  }
  return 'documentation'
}

/**
 * 生成路由
 * @param {Array} routerlist 格式化路由
 * @returns
 */
export function addRouter(routerlist) {
  const router = []

  routerlist.forEach(e => {
    let e_new = {
      path: e.id && "/" + e.id || 'norouter-' + e.fid,
      name: e.text,
      // component: e.type == 1 || e.type == 2? _router('Layout'):_router(e.id || 'error')
      component: e.type == 1 ? _router('Layout'):_router(e.id || 'error')
    }
    if (e.redirect) { // 重定向
      e_new = Object.assign({}, e_new, { redirect: e.redirect })
    }

    if (e.text) { // meta
      e_new = Object.assign({}, e_new, {
        meta: { title: e.text, icon: resolveMenuIcon(e), id: e.smuId }
      })
    }

    if (e.children && e.children.length > 1) {
      e_new.alwaysShow = true
    }

    if (e.children) { // 下级
      e_new = Object.assign({}, e_new, { children: addRouter(e.children) })
    }

   // console.log((e_new.component))
    e_new.component = e_new.component || _router('error')
    router.push(e_new)
  })

  return router
}
