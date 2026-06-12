import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import notpage from '@/views/404'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    affix: true                  if set true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const StaticRouterMap = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
}, {
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
}, {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: {
      title: '首页',
      icon: 'dashboard',
      affix: true
    }
  }]
},
  /*{
  path: '/reportBoard',
  component: Layout,
  name: 'ReportBoard',
  meta: {
    title: '报表看板',
    icon: 'component'
  },
  children: [{
    path: 'leaderDashboard',
    component: () => import('@/views/reportForm/leaderDashboard/index'),
    name: 'LeaderDashboard',
    meta: {
      title: '制造中心'
    }
  }, {
    path: 'pendingSendOrders',
    component: () => import('@/views/reportForm/pendingSendOrders/index'),
    name: 'PendingSendOrders',
    meta: {
      title: '收工序后还未交出去的订单'
    }
  }]
},{
  path: '/basic',
  component: Layout,
  name: 'Basic',
  meta: {
    title: '基础资料',
    icon: 'component'
  },
  children: [{
    path: 'users',
    component: () => import('@/views/system/users/index'),
    name: 'Users',
    meta: {
      title: '用户管理'
    }
  }, {
    path: 'material',
    component: () => import('@/views/basic/material/index'),
    name: 'Material',
    meta: {
      title: '物料管理'
    }
  }, {
    path: 'customer',
    component: () => import('@/views/basic/customer/index'),
    name: 'Customer',
    meta: {
      title: '客户管理'
    }
  }
  ]
}, {
  path: '/information',
  component: Layout,
  name: 'Information',
  meta: {
    title: '工序管理',
    icon: 'component'
  },
  children: [
    {
      path: 'processList',
      component: () => import('@/views/information/processList/index'),
      name: 'ProcessList',
      meta: {
        title: '工序清单管理'
      }
    },{
      path: 'orderList',
      component: () => import('@/views/information/orderList/index'),
      name: 'OrderList',
      meta: {
        title: '订单清单管理'
      }
    },{
      path: 'packaging',
      component: () => import('@/views/information/packaging/index'),
      name: 'Packaging',
      meta: {
        title: '包装管理'
      }
    },
  ]
}, {
  path: '/reportForm',
  component: Layout,
  name: 'ReportForm',
  meta: {
    title: '数据报表',
    icon: 'component'
  },
  children: [{
    path: 'processFlow',
    component: () => import('@/views/reportForm/processFlow/index'),
    name: 'ProcessFlow',
    meta: {
      title: '工序流转进度'
    }
  },{
    path: 'orderCompleted',
    component: () => import('@/views/reportForm/orderCompleted/index'),
    name: 'OrderCompleted',
    meta: {
      title: '订单完成情况'
    }
  },{
    path: 'processAcceptance',
    component: () => import('@/views/reportForm/processAcceptance/index'),
    name: 'ProcessAcceptance',
    meta: {
      title: '工序接收情况'
    }
  }
  ]
}, {
  path: '/reportBoard',
  component: Layout,
  name: 'ReportBoard',
  meta: {
    title: '报表看板',
    icon: 'component'
  },
  children: [{
    path: 'leaderDashboard',
    component: () => import('@/views/reportForm/leaderDashboard/index'),
    name: 'LeaderDashboard',
    meta: {
      title: '制造中心'
    }
  }, {
    path: 'pendingSendOrders',
    component: () => import('@/views/reportForm/pendingSendOrders/index'),
    name: 'PendingSendOrders',
    meta: {
      title: '收工序后还未交出去的订单'
    }
  }]
}*/
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: StaticRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
  router.options.routes = newRouter.options.routes
}

export default router
