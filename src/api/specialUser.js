import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/admin/registerlist?page=${data.page}&limit=${data.limit}`,
    method: 'post',
    data
  })
}

export function getDetails(params) {
  return request({
    url: '/admin/registerinfo',
    method: 'get',
    params
  })
}

export function updateRecord(data) {
  let url = '/admin/register'
  if (data.id) {
    url = '/admin/saveregister'
  }
  return request({
    url,
    method: 'post',
    data
  })
}
