import React, { useState } from "react";
import { useEffect } from "react";
// Importamos los Modales
import ModalAgregar from "../components/ModalAgregar";
import ModalEditar from "../components/ModalEditar";
import ModalConfirmar from "../components/ModalConfirmar";

import "./listacategorias.css"; // Asegúrate de tener estilos básicos

import { 
    obtenerCategorias, 
    eliminarCategoria, 
    crearCategoria,      // <--- AGREGAR
    actualizarCategoria  // <--- AGREGAR
} from "../api/categoria";

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para controlar qué modal se muestra
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState(null); // Contiene la categoría a editar o null
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null); // Contiene la categoría a eliminar o null

  // 1. Cargar datos iniciales al montar el componente
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const data = await obtenerCategorias();
      if (Array.isArray(data)) setCategorias(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNCIONES CENTRALIZADAS DE LA API (CRUD) ---

  // AGREGAR: Recibe {nombre, descripcion} del modal y llama a la API
  const handleCategoriaAgregada = async (nuevaData) => {
    try {
      // 1. Llamada a la API de creación
      const nuevaCat = await crearCategoria(nuevaData);
      
      // 2. >>> MODIFICACIÓN CLAVE AQUÍ: Verificar que la nueva categoría tenga un ID válido <<<
      if (nuevaCat && nuevaCat.id) {
          // Si tiene ID, actualiza el estado local directamente (más rápido)
          setCategorias([...categorias, nuevaCat]);
          console.log("Categoría creada con éxito y agregada localmente.");
      } else {
          // Si no tiene ID, forzar una recarga completa de la lista para obtener el objeto completo
          console.warn("Categoría creada, pero el objeto devuelto no tiene ID. Recargando lista...");
          await cargarCategorias();
      }

      setShowModalAgregar(false); // Cerrar modal
    } catch (error) {
      console.error("Error al crear:", error);
      console.error("Error al crear la categoría");
    }
  };

  // EDITAR: Recibe el objeto modificado del modal y llama a la API
  const handleCategoriaEditada = async (catEditada) => {
    try {
      // 1. Llamada a la API de actualización
      await actualizarCategoria(catEditada.id, {
        nombre: catEditada.nombre,
        descripcion: catEditada.descripcion
      });
      
      // 2. Actualizar el estado local (reemplazar el objeto antiguo por el nuevo)
      setCategorias(categorias.map(c => c.id === catEditada.id ? catEditada : c));
      setCategoriaAEditar(null); // Cerrar modal
      console.log("Categoría actualizada"); // Reemplazo de alert
    } catch (error) {
      console.error("Error al editar:", error);
      console.error("Error al actualizar la categoría"); // Reemplazo de alert
    }
  };

  // ELIMINAR: Se ejecuta al confirmar en el ModalConfirmar
  const confirmarEliminacion = async () => {
    if (!categoriaAEliminar) return;

    try {
        // 1. Llamada a la API de eliminación
        await eliminarCategoria(categoriaAEliminar.id);
        
        // 2. Actualizar el estado local (filtrar para quitar la eliminada)
        setCategorias(categorias.filter(c => c.id !== categoriaAEliminar.id));
        setCategoriaAEliminar(null); // Cerrar modal
        console.log("Categoría eliminada correctamente"); // Reemplazo de alert
    } catch (error) {
        console.error("Error al eliminar:", error);
        console.error("No se pudo eliminar la categoría"); // Reemplazo de alert
    }
  };

  return (
    <div className="admin-container" style={{padding: 20}}>
      <div className="admin-header" style={{display:"flex", justifyContent:"space-between", marginBottom:20}}>
        <h1>Gestión de Categorías</h1>
        <button 
            className="btn-green" 
            onClick={() => setShowModalAgregar(true)}
        >
            + Nueva Categoría
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : categorias.length === 0 ? (
        <p style={{textAlign: 'center', marginTop: '50px', fontSize: '1.2em', color: '#888'}}>
          No se encontraron categorías. Intenta agregar una nueva.
        </p>
      ) : (
        <table className="tabla-categorias" style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:"#f4f4f4", textAlign:"left"}}>
              <th style={{padding:10}}>ID</th>
              <th style={{padding:10}}>Nombre</th>
              <th style={{padding:10}}>Descripción</th>
              <th style={{padding:10}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id} style={{borderBottom:"1px solid #eee"}}>
                <td style={{padding:10}}>{String(cat.id).substring(0, 8)}...</td>
                <td style={{padding:10}}><strong>{cat.nombre}</strong></td>
                <td style={{padding:10}}>{cat.descripcion || "-"}</td>
                <td style={{padding:10}}>
                  <button 
                    onClick={() => setCategoriaAEditar(cat)}
                    style={{marginRight:10, cursor:"pointer", padding:"5px 10px"}}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => setCategoriaAEliminar(cat)}
                    style={{color:"white", background:"red", border:"none", borderRadius:4, cursor:"pointer", padding:"5px 10px"}}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* --- MODALES CONECTADOS --- */}
      
      {/* 1. Modal Agregar */}
      <ModalAgregar 
        isOpen={showModalAgregar} 
        onClose={() => setShowModalAgregar(false)}
        onAgregar={handleCategoriaAgregada} // Le pasamos la función que tiene la lógica de la API
      />

      {/* 2. Modal Editar */}
      <ModalEditar
        isOpen={!!categoriaAEditar}
        onClose={() => setCategoriaAEditar(null)}
        onEditar={handleCategoriaEditada} // Le pasamos la función que tiene la lógica de la API
        categoria={categoriaAEditar} // Le pasamos el objeto a editar
      />

      {/* 3. Modal Confirmar Eliminar */}
      <ModalConfirmar
        isOpen={!!categoriaAEliminar}
        onClose={() => setCategoriaAEliminar(null)}
        onConfirm={confirmarEliminacion} // Le pasamos la función que tiene la lógica de la API
      />

    </div>
  );
}