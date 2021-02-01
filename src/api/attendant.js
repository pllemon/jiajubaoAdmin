import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/admin/customerlist?page=${data.page}&limit=${data.limit}`,
    method: 'post',
    data
  })
}

export function getDetails(params) {
  return request({
    url: '/admin/customerinfo',
    method: 'get',
    params
  })
}

export function updateRecord(data) {
  let url = '/admin/addcustomer'
  if (data.id) {
    url = '/admin/savecustomer'
  }
  return request({
    url,
    method: 'post',
    data
  })
}
