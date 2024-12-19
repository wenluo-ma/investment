import request from '@/utils/request'

export function getCardPage(data) {
  return request({
    url: '/system/research-event/page',
    method: 'post',
    data: data
  })
}

export function createCrad(data) {
  return request({
    url: '/system/research-event/create',
    method: 'post',
    data: data
  })
}
export function updateCrad(data) {
  return request({
    url: '/system/research-event/update',
    method: 'post',
    data: data
  })
}
export function deleteCard(data) {
  return request({
    url: '/system/research-event/delete',
    method: 'post',
    data: data
  })
}

export function getTablePage(data) {
  return request({
    url: '/system/research-event-meeting/get',
    method: 'post',
    data: data
  })
}

export function createTable(data) {
  return request({
    url: '/system/research-event-meeting/create',
    method: 'post',
    data: data
  })
}
export function updateTable(data) {
  return request({
    url: '/system/research-event-meeting/update',
    method: 'post',
    data: data
  })
}
export function deleteTable(data) {
  return request({
    url: '/system/research-event-meeting/delete',
    method: 'post',
    data: data
  })
} 
