// src/api/carritoApi.js
import { apiRequest } from './httpClient';

/**
 * Obtener el carrito del usuario autenticado
 * GET /carrito
 */
export function obtenerCarrito() {
  return apiRequest('carrito', {
    method: 'GET',
  });
}

/**
 * Agregar un producto al carrito
 * POST /carrito/agregar-item
 *
 * Body esperado:
 * { "itemId": "id-del-producto" }
 */
export function agregarItemAlCarrito(productId) {
  return apiRequest('carrito/agregar-item', {
    method: 'POST',
    body: JSON.stringify({
      itemId: productId,
    }),
  });
}

/**
 * Vaciar el carrito completo
 * GET /carrito/vaciar
 */
export function vaciarCarrito() {
  return apiRequest('carrito/vaciar', {
    method: 'GET',
  });
}

/**
 * Actualizar la cantidad de un item del carrito
 * POST /carrito/actualizar-item/:idProducto
 *
 * Body esperado:
 * { "cantidad": number }
 */
export function actualizarCantidadItemCarrito(idProducto, cantidad) {
  return apiRequest(`carrito/actualizar-item/${idProducto}`, {
    method: 'POST',
    body: JSON.stringify({ cantidad }),
  });
}

/**
 * Eliminar un item del carrito
 * DELETE /carrito/eliminar-item/:idProducto
 */
export function eliminarItemDelCarrito(idProducto) {
  return apiRequest(`carrito/eliminar-item/${idProducto}`, {
    method: 'DELETE',
  });
}
