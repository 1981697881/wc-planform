let hasMenu = false
let loadedMenuType = null

export function getHasMenu() {
  return hasMenu
}

export function setHasMenu(val) {
  hasMenu = val
}

export function getLoadedMenuType() {
  return loadedMenuType
}

export function setLoadedMenuType(val) {
  loadedMenuType = val
}

export function resetDynamicMenu() {
  hasMenu = false
  loadedMenuType = null
}

export function findFirstMenuPath(routes, parentPath = '', options = {}) {
  const { excludeDashboard = false } = options
  for (const route of routes) {
    if (route.path === '*' || route.hidden) continue
    const fullPath = route.path.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, '/')
    if (route.children && route.children.length) {
      const found = findFirstMenuPath(route.children, fullPath, options)
      if (found) return found
    } else if (route.component) {
      if (excludeDashboard && (fullPath === '/dashboard' || route.path === 'dashboard' || route.name === 'Dashboard')) {
        continue
      }
      return fullPath
    }
  }
  return null
}

export function findPathContaining(routes, segment, parentPath = '') {
  for (const route of routes) {
    if (route.hidden || route.path === '*') continue
    const fullPath = route.path.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, '/')
    if (route.path === segment || fullPath.endsWith('/' + segment)) {
      if (route.component && (!route.children || !route.children.length)) {
        return fullPath
      }
    }
    if (route.children && route.children.length) {
      const found = findPathContaining(route.children, segment, fullPath)
      if (found) return found
    }
  }
  return null
}

export function findReportFirstMenuPath(routes) {
  const leaderPath = findPathContaining(routes, 'leaderDashboard')
  if (leaderPath) return leaderPath
  return findFirstMenuPath(routes, '', { excludeDashboard: true })
}

export function isPathInRoutes(path, routes, parentPath = '') {
  for (const route of routes) {
    if (route.path === '*') continue
    const fullPath = route.path.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, '/')
    if (fullPath === path) return true
    if (route.children && route.children.length && isPathInRoutes(path, route.children, fullPath)) {
      return true
    }
  }
  return false
}

export function resolveTargetPath(toPath, asyncRouter, staticRoutes, loginMode) {
  if (loginMode === 'report') {
    const reportPath = findReportFirstMenuPath(asyncRouter || [])
    const allRoutes = (staticRoutes || []).concat(asyncRouter || [])
    const isHomePath = !toPath || toPath === '/' || toPath === '/dashboard'
    if (isHomePath) {
      return reportPath || '/'
    }
    if (isPathInRoutes(toPath, allRoutes)) {
      return toPath
    }
    return reportPath || '/'
  }
  const allRoutes = (staticRoutes || []).concat(asyncRouter || [])
  if (toPath && toPath !== '/' && isPathInRoutes(toPath, allRoutes)) {
    return toPath
  }
  return '/dashboard'
}

export function filterSidebarRoutes(routes, loginMode) {
  if (loginMode !== 'report') {
    return routes
  }
  return routes.filter(route => {
    if (route.path === '/' && route.redirect === '/dashboard') {
      return false
    }
    return true
  })
}
