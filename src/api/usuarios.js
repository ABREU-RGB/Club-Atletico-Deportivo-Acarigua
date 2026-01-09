import request from '@/utils/request'

export function getUsuarios(params) {
  return request({
    url: '/usuarios',
    method: 'get',
    params
  })
}

export function getUsuarioById(id) {
  return request({
    url: `/usuarios/${id}`,
    method: 'get'
  })
}

export function createUsuario(data) {
  return request({
    url: '/usuarios',
    method: 'post',
    data
  })
}

export function updateUsuario(id, data) {
  return request({
    url: `/usuarios/${id}`,
    method: 'put',
    data
  })
}

export function deleteUsuario(id) {
  return request({
    url: `/usuarios/${id}`,
    method: 'delete'
  })
}
