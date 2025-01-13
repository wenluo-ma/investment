import request from '@/utils/request'

export function getTablePage(data) {
  return request({
    url: '/system/market-setting/list',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/system/market-setting/update',
    method: 'post',
    data
  })
}
