import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/admin/salesmanlist?page=${data.page}&limit=${data.limit}`,
    method: 'post',
    data
  })
}

export function getDetails(params) {
  return request({
    url: '/admin/salesmaninfo',
    method: 'get',
    params
  })
}

export function updateRecord(data) {
  let url = '/admin/addsalesman'
  if (data.id) {
    url = '/admin/savesalesman'
  }
  return request({
    url,
    method: 'post',
    data
  })
}
