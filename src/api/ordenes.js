// src/api/ordenesApi.js
import { apiRequest } from './httpClient';

/**
 * Crear una nueva orden
 * POST /ordenes/crear
 * Body esperado por tu backend:
 * {
 *   direccionEnvio: string,
 *   metodoPago: string
 * }
 */
export function crearOrden({ direccionEnvio, metodoPago }) {
  return apiRequest('ordenes/crear', {
    method: 'POST',
    body: JSON.stringify({
      direccionEnvio,
      metodoPago,
    }),
  });
}

/**
 * Obtener todas las órdenes del usuario autenticado
 * GET /ordenes/ordenes-por-usuario
 */
export function obtenerOrdenesPorUsuario() {
  return apiRequest('ordenes/ordenes-por-usuario', {
    method: 'GET',
  });
}

/**
 * Marcar una orden como pagada
 * PUT /ordenes/:idOrden/pagar
 *
 * EJEMPLO REAL:
 * PUT https://backend-pragraweb-production.up.railway.app/ordenes/186161ce-3f2d-4723-92c5-e578c9d7b8bb/pagar
 */
export function pagarOrden(idOrden) {
  return apiRequest(`ordenes/${idOrden}/pagar`, {
    method: 'PUT',
  });
}

export function obtenerOrdenesPorUsuarioId(idUsuario) {
  return apiRequest(`ordenes/ordenes-por-usuario-id/${idUsuario}`, {
    method: 'GET',
  });
}

export function listarOrdenes() {
  return apiRequest('ordenes', {
    method: 'GET',
  });
}