export default file => {
  return map[file] || null
}

const map = {
  Layout: () => import('@/layout'),
  error: () => import('@/views/404'),
  '/basic': () => import('@/layout'),
  'material': () => import('@/views/basic/material'),
  'customer': () => import('@/views/basic/customer'),

  'packaging': () => import('@/views/information/packaging'),
  'processList': () => import('@/views/information/processList'),
  'orderList': () => import('@/views/information/orderList'),

  'processFlow': () => import('@/views/reportForm/processFlow'),
  'orderCompleted': () => import('@/views/reportForm/orderCompleted'),
  'bonusSummary': () => import('@/views/reportForm/bonusSummary'),
  'incomeDetail': () => import('@/views/reportForm/incomeDetail'),
  'outsourcingBonusDetails': () => import('@/views/reportForm/outsourcingBonusDetails'),
  'outsourcingBonusSummary': () => import('@/views/reportForm/outsourcingBonusSummary'),

}
