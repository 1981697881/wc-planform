import request from '@/utils/request'
import {
  getToken
} from '@/utils/auth' // get token from cookie
export function getRouter(menuType) {
  return request({
    headers: {
      'authorization': getToken('wcrx'),
    },
    url: '/sysMenu/getByUser/' + menuType,
    method: 'get',
  })
}
