
import React , { useState, useEffect } from "react";
import "./ModalEditar.css";

import { actualizarCategoria } from "../api/categoria"; 

function ModalEditar({ isOpen, onClose, onEditar, categoria }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [loading, setLoading] = useState(false);

    // Precargar datos al abrir
    useEffect(() => {
        if (categoria) {
            setNombre(categoria.nombre || "");
            setDescripcion(categoria.descripcion || "");
        }
    }, [categoria]);

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
            // Importante: Usamos categoria.id que viene de la base de datos
            await actualizarCategoria(categoria.id, {
                nombre,
                descripcion
            });

            // 2. Actualizar la vista local
            const categoriaActualizada = {
                ...categoria,
                nombre,
                descripcion
            };
            onEditar(categoriaActualizada);
            
            // 3. Cerrar
            onClose();
            alert("Categoría actualizada correctamente ✅");

        } catch (error) {
            console.error("Error actualizando:", error);
            alert("No se pudo actualizar la categoría.");
        } finally {
            setLoading(false);
        }
    };

    return (
         <div className="modal-overlay3">
            <div className="modal-container3">
                <h2>Editar Categoría</h2>
        
                <form className="form-modal3" onSubmit={handleSubmit}>
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        disabled={loading}
                    />

                    <label>Descripción:</label>
                    <input 
                        className="input-description" 
                        type="text" 
                        value={descripcion} 
                        onChange={(e) => setDescripcion(e.target.value)}
                        disabled={loading}
                    />

                    <div className="modal-buttons3">
                        <button type="submit" className="btn-guardar" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                        <button type="button" className="btn-cancelar" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default ModalEditar;