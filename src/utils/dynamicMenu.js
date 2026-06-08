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

export function findFirstMenuPath(routes, parentPath = '') {
  for (const route of routes) {
    if (route.path === '*' || route.hidden) continue
    const fullPath = route.path.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, '/')
    if (route.children && route.children.length) {
      const found = findFirstMenuPath(route.children, fullPath)
      if (found) return found
    } else if (route.component) {
      return fullPath
    }
  }
  return null
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
  const allRoutes = (staticRoutes || []).concat(asyncRouter || [])
  if (toPath && toPath !== '/' && isPathInRoutes(toPath, allRoutes)) {
    return toPath
  }
  if (loginMode === 'report') {
    return findFirstMenuPath(asyncRouter) || '/'
  }
  return '/dashboard'
}
