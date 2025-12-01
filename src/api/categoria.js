// src/api/categoriasApi.js
import { apiRequest } from './httpClient';

/**
 * Crear una nueva categoría
 * POST /categorias
 *
 * Body esperado:
 * {
 *   "nombre": "prueba1",
 *   "descripcion": "prueba2"
 * }
 */
export function crearCategoria(datosCategoria) {
  return apiRequest('categorias', {
    method: 'POST',
    body: JSON.stringify(datosCategoria),
  });
}

/**
 * Obtener todas las categorías
 * GET /categorias
 */
export function obtenerCategorias() {
  return apiRequest('categorias', {
    method: 'GET',
  });
}

/**
 * Actualizar una categoría por id
 * PUT /categorias/:id
 *
 * Body esperado:
 * {
 *   "nombre": "nuevo nombre",
 *   "descripcion": "nueva descripcion"
 * }
 */
export function actualizarCategoria(idCategoria, nuevosDatos) {
  return apiRequest(`categorias/${idCategoria}`, {
    method: 'PUT',
    body: JSON.stringify(nuevosDatos),
  });
}

/**
 * Eliminar una categoría por id
 * DELETE /categorias/:id
 */
export function eliminarCategoria(idCategoria) {
  return apiRequest(`categorias/${idCategoria}`, {
    method: 'DELETE',
  });
}
