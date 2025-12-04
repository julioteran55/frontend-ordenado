// src/api/authApi.js
import { apiRequest, setToken, clearToken } from './httpClient';

// POST /auth/register (ejemplo)
export function registerUser(payload) {
  // payload podría ser: { nombre, email, password }
  // ajusta los campos a lo que pida tu backend
  return apiRequest('auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// POST /auth/login
export async function login(payload) {
  // payload: { email, password } (ajústalo a tu backend)
  const data = await apiRequest('auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // Asumo que el backend te devuelve { token, user, ... }
  if (data.token) {
    setToken(data.token);
  }

  return data;
}

// logout (frontend)
export function logoutApi() {
  clearToken();
}

export async function changePasswordApi(payload){

  const data = await apiRequest('auth/change-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return data;

}
