import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/admin/businesslist?page=${data.page}&limit=${data.limit}`,
    method: 'post',
    data
  })
}

export function savebusiness(params) {
  return request({
    url: '/admin/savebusiness',
    method: 'get',
    params
  })
}

export function businessinfo(params) {
  return request({
    url: '/admin/businessinfo',
    method: 'get',
    params
  })
}

export function businessexamine(data) {
  return request({
    url: '/admin/businessexamine',
    method: 'post',
    data
  })
}

export function businesscashinlist(data) {
  return request({
    url: `/admin/businesscashinlist?page=${data.page}&limit=${data.limit}`,
    method: 'post',
    data
  })
}

export function savebusinessstatus(data) {
  return request({
    url: '/admin/savebusinessstatus',
    method: 'post',
    data
  })
}


export function businessgoodslist(data) {
  return request({
    url: '/admin/businessgoodslist',
    method: 'post',
    data
  })
}

// 设置和获取单个商品价格
export function upgoodsprice(data) {
  return request({
    url: '/admin/upgoodsprice',
    method: 'post',
    data
  })
}