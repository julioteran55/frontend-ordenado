// src/api/usersApi.js
import { apiRequest } from './httpClient';

// GET /users  (ejemplo)
export function listarUsuarios() {
  return apiRequest('/usuarios', {
    method: 'GET',
  });
}
