// src/api/usersApi.js
import { apiRequest } from './httpClient';

// GET /users  (ejemplo)
export function listarUsuarios() {
  return apiRequest('usuarios', {
    method: 'GET',
  });
}

export function actualizarUsuario(idUsuario,body){

  return apiRequest(`usuarios/${idUsuario}`,{
    method : 'PUT',
    body: JSON.stringify(body),
  })
}


export function eliminarUsuario(idUsuario) {
  return apiRequest(`usuarios/${idUsuario}`, {
    method: 'DELETE',
  });
}

export function verUsuario(idUsuario){
  return apiRequest(`usuarios/${idUsuario}`, {
    method: 'GET',
  });
}
