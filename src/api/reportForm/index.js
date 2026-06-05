import request from '@/utils/request'
import {
  getToken
} from '@/utils/auth'

// 报表管理-招聘,BD,团队奖金汇总表
export function recruitmentBonus(params, query) {
  const url = '/summary/recruitmentBonus/' + params.pageNum + '/' + params.pageSize
  return request({
    url: url,
    headers: {
      'authorization': getToken('wcrx'),
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: query
  })
}

// 报表管理-外包奖金汇总表
export function tprojectOutsourcingBonus(params, query) {
  const url = '/summary/tprojectOutsourcingBonus/' + params.pageNum + '/' + params.pageSize
  return request({
    url: url,
    headers: {
      'authorization': getToken('wcrx'),
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: query
  })
}

// 报表管理-订单完成情况报表
export function poReport(params, query) {
  const url = '/prodOrder/poReportByPage/' + params.pageNum + '/' + params.pageSize
  return request({
    url: url,
    headers: {
      'authorization': getToken('wcrx'),
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: query
  })
}// 报表管理-工序接收情况报表
export function processRecReportByPage(params, query) {
  const url = '/prodProcess/processRecReportByPage/' + params.pageNum + '/' + params.pageSize
  return request({
    url: url,
    headers: {
      'authorization': getToken('wcrx'),
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: query
  })
}
// 报表管理-工序流转进度查看
export function processSRReport(params, query) {
  const url = '/prodProcess/processSRReportByPage/' + params.pageNum + '/' + params.pageSize
  return request({
    url: url,
    headers: {
      'authorization': getToken('wcrx'),
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: query
  })
}

// 报表看板-领导看板（各部门交工序累计数量）
export function leaderBoardReport(query = {}) {
  return request({
    url: '/prodProcess/leaderBoardReport',
    headers: {
      'authorization': getToken('wcrx'),
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: query
  })
}

// 报表看板-收工序后还未交出去的订单
export function pendingSendReportByPage(params, query) {
  const url = '/prodProcess/pendingSendReportByPage/' + params.pageNum + '/' + params.pageSize
  return request({
    url: url,
    headers: {
      'authorization': getToken('wcrx'),
      'Content-Type': 'application/json'
    },
    method: 'POST',
    data: query
  })
}
