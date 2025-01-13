import request from '@/utils/request'

export function getTablePage(data) {
  return request({
    url: '/system/field-setting/list',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/system/field-setting/create',
    method: 'post',
    data
  })
}
export function deleteTable(data) {
  return request({
    url: '/system/field-setting/delete',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/system/field-setting/update',
    method: 'post',
    data
  })
}
