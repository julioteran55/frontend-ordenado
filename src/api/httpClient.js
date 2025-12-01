// src/api/httpClient.js
const BACKEND_URL = 'https://backend-pragraweb-production.up.railway.app/'; // 

function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export async function apiRequest(path, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // Bearer token para rutas protegidas
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const message = text || res.statusText || 'Error en la petición';

    // Ejemplo: si el token está mal o expirado
    if (res.status === 401) {
      // aquí podrías hacer logout automático si quieres
      // clearToken();
    }

    throw new Error(`Error ${res.status}: ${message}`);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}
