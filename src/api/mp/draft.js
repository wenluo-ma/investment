import request from '@/utils/request'

// 获得公众号草稿分页
export function getDraftPage(query) {
  return request({
    url: '/mp/draft/page',
    method: 'get',
    params: query
  })
}

// 创建草稿
export function createDraft(accountId, articles) {
  return request({
    url: '/mp/draft/create?accountId=' + accountId,
    method: 'post',
    data: {
      articles
    }
  })
}
