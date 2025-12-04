// src/components/ProductCreationModal.jsx

import React, { useState } from 'react';
import { crearProducto } from '../api/productos'; // Importar la función de creación

// Recibimos las categorías como prop
const ProductCreationModal = ({ isOpen, onClose, onProductCreated, categorias }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    presentacion: "",
    descripcion: "",
    stock: 0,
    precio: 0.0,
    categoriaId: "", // Ya no es solo un ID, sino la clave para el select
    imagen: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: (name === 'stock' || name === 'precio') ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoriaId) {
        alert("Por favor, selecciona una categoría.");
        return;
    }

    try {
      await crearProducto(formData);
      alert("Producto creado exitosamente.");
      onProductCreated(); 
      onClose(); 
      // Limpia el formulario
      setFormData({
        nombre: "",
        presentacion: "",
        descripcion: "",
        stock: 0,
        precio: 0.0,
        categoriaId: "", 
        imagen: "",
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      alert("Hubo un error al crear el producto. Revisa la consola.");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      zIndex: 1000 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        width: '400px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
      }}>
        <h3>Agregar Nuevo Producto</h3>
        <form onSubmit={handleSubmit}>
          {/* ... Campos existentes ... */}
          <p><label>Nombre:<input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required /></label></p>
          <p><label>Presentación:<input type="text" name="presentacion" value={formData.presentacion} onChange={handleChange} /></label></p>
          <p><label>Descripción:<textarea name="descripcion" value={formData.descripcion} onChange={handleChange} /></label></p>
          <p><label>Stock:<input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" /></label></p>
          <p><label>Precio:<input type="number" name="precio" value={formData.precio} onChange={handleChange} required min="0" step="0.01" /></label></p>
          
          {/* ⭐ Nuevo campo de Categoría con SELECT */}
          <p>
            <label>
              Categoría:
              <select 
                name="categoriaId" 
                value={formData.categoriaId} 
                onChange={handleChange} 
                required
                style={{ marginLeft: '10px' }}
              >
                <option value="">-- Selecciona una categoría --</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </label>
          </p>
          {/* Fin SELECT */}

          <p><label>Imagen URL:<input type="text" name="imagen" value={formData.imagen} onChange={handleChange} /></label></p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <button type="button" className="btn-grey" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-green">Crear Producto</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreationModal;