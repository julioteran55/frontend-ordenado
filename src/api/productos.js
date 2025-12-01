// src/api/productosApi.js
import { apiRequest } from './httpClient';

/**
 * Crear un nuevo producto
 * POST /productos
 *
 * Body esperado (según tu Postman):
 * {
 *   "nombre": "Arroz Extra",
 *   "presentacion": "Bolsa 1kg",
 *   "descripcion": "Arroz de alta calidad, grano largo.",
 *   "stock": 80,
 *   "precio": 4,
 *   "categoriaId": "699a308e-a781-4e85-bcf0-aae08e047fd6",
 *   "imagen": "https://example.com/arroz1kg.jpg"
 * }
 */
export function crearProducto(producto) {
  // producto es un objeto con las propiedades de arriba
  return apiRequest('productos', {
    method: 'POST',
    body: JSON.stringify(producto),
  });
}

/**
 * Obtener todos los productos
 * GET /productos
 */
export function obtenerProductos() {
  return apiRequest('productos', {
    method: 'GET',
  });
}

/**
 * Actualizar un producto por id
 * PUT /productos/:id
 *
 * Ejemplo de body en tu Postman:
 * { "nombre": "actualizado" }
 *
 * Puedes enviar solo los campos que quieres cambiar.
 */
export function actualizarProducto(idProducto, camposActualizados) {
  return apiRequest(`productos/${idProducto}`, {
    method: 'PUT',
    body: JSON.stringify(camposActualizados),
  });
}

/**
 * Eliminar un producto por id
 * DELETE /productos/:id
 */
export function eliminarProducto(idProducto) {
  return apiRequest(`productos/${idProducto}`, {
    method: 'DELETE',
  });
}
