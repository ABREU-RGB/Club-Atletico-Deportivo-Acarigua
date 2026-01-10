import request from '@/utils/request'

export function getPlantel(params) {
  return request({
    url: '/plantel',
    method: 'get',
    params
  })
}

export function getPlantelByRol(rol) {
  return request({
    url: `/plantel/rol/${rol}`,
    method: 'get'
  })
}

export function createPlantel(data) {
  return request({
    url: '/plantel',
    method: 'post',
    data
  })
}

export function updatePlantel(id, data) {
  return request({
    url: `/plantel/${id}`,
    method: 'put',
    data
  })
}

export function deletePlantel(id) {
  return request({
    url: `/plantel/${id}`,
    method: 'delete'
  })
}
