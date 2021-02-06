import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/admin/servertypelist?page=${data.page}&limit=${data.limit}`,
    method: 'post',
    data
  })
}

export function getDetails(params) {
  return request({
    url: '/admin/servertypeinfo',
    method: 'get',
    params
  })
}

export function updateRecord(data, id) {
  console.log(data)
  console.log(id)
  let url = '/admin/addservertype'
  if (id) {
    url = '/admin/saveservertype'
  }
  return request({
    url: url,
    method: 'post',
    data
  })
}



export function updateServertype(data) {
  return request({
    url: '/admin/saveservertype',
    method: 'post',
    data
  })
}