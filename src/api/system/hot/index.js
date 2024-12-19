import request from '@/utils/request'

export function getHotPage(data) {
  return request({
    url: '/system/quick-search/page',
    method: 'post',
    data: data
  })

}
// export function getHotPage(data) {
//   return request({
//     url: '/system/quick-search/list',
//     method: 'get',
//     data
//   })
// }

export function top(data) {
  return request({
    url: `/system/quick-search/top`,
    method: 'post',
    data: data
  })
}
export function deleteWord(data) {
  return request({
    url: '/system/quick-search/delete',
    method: 'post',
    data: data
  })
}
