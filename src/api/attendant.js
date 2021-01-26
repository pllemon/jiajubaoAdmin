import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/admin/networkuserlist?page=${data.page}&limit=${data.limit}`,
    method: 'post',
    data
  })
}

export function getDetails(params) {
  return request({
    url: '/admin/networkuserinfo',
    method: 'get',
    params
  })
}

export function updateRecord(data) {
  let url = '/admin/addnetworkuser'
  if (data.id) {
    url = '/admin/savenetworkuser'
  }
  return request({
    url,
    method: 'post',
    data
  })
}
