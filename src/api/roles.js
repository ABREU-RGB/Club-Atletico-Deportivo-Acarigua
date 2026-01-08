import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}

export function getRolById(id) {
  return request({
    url: `/roles/${id}`,
    method: 'get'
  })
}

export function createRol(data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

export function updateRol(id, data) {
  return request({
    url: `/roles/${id}`,
    method: 'put',
    data
  })
}

export function deleteRol(id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}
