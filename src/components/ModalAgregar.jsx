
import "./ModalAgregar.css";
import React, { useState } from "react";
import { crearCategoria } from "../api/categoria"; // Ajusta la ruta según tu estructura

function ModalAgregar({ isOpen, onClose, onAgregar }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !descripcion.trim()) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      setLoading(true);
      
      // 1. Llamada al Backend
      const nuevaCategoria = await crearCategoria({
        nombre,
        descripcion
      });

      // 2. Actualizar la vista (pasamos la nueva categoría creada por el servidor)
      onAgregar(nuevaCategoria);
      
      // 3. Limpiar y cerrar
      setNombre("");
      setDescripcion("");
      onClose();
      alert("Categoría creada con éxito ✅");

    } catch (error) {
      console.error("Error creando categoría:", error);
      alert("Error al crear la categoría. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Nueva Categoría</h2>
        
        <form className="form-modal" onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input 
            type="text" 
            placeholder="Ej: Bebidas" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)}
            disabled={loading}
          />

          <label>Descripción:</label>
          <input 
            className="input-description" 
            type="text" 
            placeholder="Descripción breve..." 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={loading}
          />

          <div className="modal-buttons">
            <button 
                type="submit" 
                className="btn-guardar" 
                disabled={loading || !nombre.trim() || !descripcion.trim()} 
            >
                {loading ? "Guardando..." : "Crear Categoría"}
            </button>
            <button 
                type="button" 
                className="btn-cerrar" 
                onClick={onClose}
                disabled={loading}
            >
                Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAgregar;