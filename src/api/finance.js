import request from '@/utils/request'

export function transactionlog(data) {
  return request({
    url: `/admin/transactionlog?page=${data.page}&limit=${data.limit}`,
    method: 'post',
    data
  })
}

export function expendituretransaction(data) {
  return request({
    url: `/admin/expendituretransaction?page=${data.page}&limit=${data.limit}`,
    method: 'post',
    data
  })
}
