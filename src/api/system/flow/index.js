import request from '@/utils/request'

export function getTablePage(data) {
  return request({
    url: '/system/flow-templates/page',
    method: 'post',
    data: data
  })
}
export function updateStatus(data) {
  return request({
    url: '/system/flow-templates/approval',
    method: 'post',
    data: data
  })
}
export function repeal(data) {
  return request({
    url: '/system/flow-templates/repeal',
    method: 'post',
    data: data
  })
}

