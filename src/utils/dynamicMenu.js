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
