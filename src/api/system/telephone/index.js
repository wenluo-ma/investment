import request from '@/utils/request'

export function getTableList(data) {
  return request({
    url: '/system/teleconference/list',
    method: 'post',
    data: data
  })
}

export function addTable(data) {
  return request({
    url: '/system/teleconference/create',
    method: 'post',
    data: data
  })
}
export function updateTable(data) {
  return request({
    url: '/system/teleconference/update',
    method: 'post',
    data: data
  })
}

export function deleteTable(data) {
  return request({
    url: '/system/teleconference/delete',
    method: 'post',
    data: data
  })
}

export function exportMeetingExcel(data) {
  return request({
    url: '/system/teleconference/export-excel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
export function exportMeetingTemplate(data) {
  return request({
    url: '/system/teleconference/export-template',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

export function importMeetingExcel(data) {
  return request({
    url: '/system/teleconference/import-excel',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
