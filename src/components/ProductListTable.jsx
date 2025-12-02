import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Importaciones de APIs
import { obtenerProductos, eliminarProducto, actualizarProducto } from "../api/productos.js"; 
import { obtenerCategorias } from "../api/categoria.js"; 
// Importa el Modal, ya que dijiste que funciona bien
import ProductCreationModal from "./ProductCreationModal"; 
import "./ProductListTable.css";

const ProductListTable = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]); 
  const [busqueda, setBusqueda] = useState("");
  const [editingId, setEditingId] = useState(null); // ID del producto en edición
  const [editData, setEditData] = useState({}); // Datos temporales de edición
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // Función para cargar productos (sin cambios)
  const cargarProductos = useCallback(async () => {
    try {
      const data = await obtenerProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  }, []);

  // Función para cargar categorías (sin cambios)
  const cargarCategorias = useCallback(async () => {
    try {
      const data = await obtenerCategorias();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, [cargarProductos, cargarCategorias]);

  // Funciones handleDelete y renderImagen (sin cambios)
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) {
      try {
        await eliminarProducto(id);
        alert("Producto eliminado correctamente");
        cargarProductos();
      } catch (error) {
        console.error(error);
        alert("Hubo un error al eliminar (¿Tienes permisos de administrador?)");
      }
    }
  };

  const renderImagen = (imgUrl) => {
    if (!imgUrl) return "/unknown.jpg";
    return (imgUrl.startsWith("http") || imgUrl.startsWith("/")) ? imgUrl : `/${imgUrl}`;
  };


  // --- Lógica de Edición ---

  // 1. Iniciar Edición
  // En ProductListTable.jsx

const handleEditStart = (product) => {
    setEditingId(product.id);
    const categoriaId = typeof product.categoria === 'object' 
        ? product.categoria?.id 
        : product.categoria;

    setEditData({
      id: product.id,
      nombre: product.nombre,
      presentacion: product.presentacion,
      descripcion: product.descripcion,
      stock: product.stock,
      precio: product.precio,
      // Usamos '' para que el <select> muestre la opción "Selecciona Categoría"
      categoriaId: categoriaId || '', 
      imagen: product.imagen || '', 
    });
};

  // 2. Manejar Cambios Locales en los Inputs
 // En ProductListTable.jsx

const handleEditChange = (name, value) => {
    let finalValue = value;
    
    // 💡 Aseguramos que stock y precio sean NUMBERS para evitar errores de tipo en el backend
    if (name === 'stock' || name === 'precio') {
      finalValue = Number(value); 
    }
    
    setEditData((prev) => ({ ...prev, [name]: finalValue }));
};
  // En ProductListTable.jsx

// En ProductListTable.jsx

const handleEditSave = async () => {
    const originalProduct = productos.find(p => p.id === editData.id);
    if (!originalProduct) {
        setEditingId(null);
        return;
    }

    const changes = {};
    let changed = false;

    const fieldsToCompare = ['nombre', 'presentacion', 'descripcion', 'stock', 'precio', 'imagen'];

    // 1. Manejo de Categoria ID 🚨 LA CORRECCIÓN CLAVE 🚨
    const originalCategoriaId = typeof originalProduct.categoria === 'object' 
        ? originalProduct.categoria?.id 
        : originalProduct.categoria;
        
    const newCategoriaId = editData.categoriaId; // Valor actual del select (ID o "")
    
    // Convertimos ambos a string para una comparación segura
    const originalCatString = String(originalCategoriaId || '');
    const newCatString = String(newCategoriaId || '');

    if (newCatString !== originalCatString) {
        // El valor cambió. Ahora decidimos qué enviar:
        if (newCatString === "") {
            // El usuario seleccionó la opción vacía. Si el backend acepta null para desvincular, envíalo.
            // Si el backend lo rechaza, puedes optar por NO enviarlo. Dejaremos esta línea comentada.
            // changes.categoriaId = null; // Enviar null para desvincular
            // changed = true;
            // 💡 Opción más segura: Si es vacío, NO lo envíes a menos que sepa que el backend acepta "null".
            // Para el propósito de esta solución, vamos a OMITIR enviar `categoriaId: ""`
        } else {
            // Se seleccionó una nueva categoría (ID válido)
            changes.categoriaId = newCategoriaId;
            changed = true;
        }
    }


    // 2. Comparar los demás campos (Stock, Precio, Nombre, etc.)
    fieldsToCompare.forEach(field => {
        let originalValue = originalProduct[field] ?? '';
        let newValue = editData[field] ?? '';
        
        if (field === 'stock' || field === 'precio') {
            const originalNum = Number(originalValue);
            const newNum = Number(newValue);

            if (originalNum !== newNum) {
                changes[field] = editData[field]; // Enviamos el valor numérico
                changed = true;
            }
        } else {
            if (String(originalValue) !== String(newValue)) {
                changes[field] = editData[field];
                changed = true;
            }
        }
    });

    setEditingId(null); // Salir del modo edición

    if (changed) {
      console.log('ID:', editData.id);
      console.log('Cuerpo enviado (solo campos modificados):', changes); 
      
      try {
        await actualizarProducto(editData.id, changes); 
        alert(`Producto ${editData.nombre} actualizado correctamente`);
        await cargarProductos();
        
      } catch (error) {
        console.error("Error al actualizar producto:", error);
        alert("Hubo un error al actualizar (revisa si los valores numéricos son correctos).");
        await cargarProductos(); 
      }
    } else {
      alert("No se detectaron cambios para guardar.");
    }
};

  // 4. Cancelar Edición
  const handleEditCancel = () => {
      setEditingId(null); // Simplemente salir del modo edición
      setEditData({}); // Limpiar datos temporales
  }

  // 🎨 Componente de celda editable/de visualización (Modificado: Removido onBlur/onKeyDown Save)
  const renderCell = (prod, field, type = 'text') => {
    const isEditing = editingId === prod.id;
    let displayValue;
    
    if (field === 'categoria') {
        displayValue = typeof prod.categoria === 'object' ? prod.categoria?.nombre : (prod.categoriaId || 'N/A');
    } else {
        displayValue = prod[field];
    }

    if (isEditing) {
        // --- Modo Edición: SELECT para Categoría ---
        if (field === 'categoria') {
            return (
                <td>
                    <select
                        name="categoriaId"
                        value={editData.categoriaId}
                        onChange={(e) => handleEditChange('categoriaId', e.target.value)}
                        style={{ width: '100%', minWidth: '100px', padding: '4px' }}
                    >
                        <option value="">Selecciona Categoría</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </td>
            );
        }

        // --- Modo Edición: INPUT para otros campos ---
        let inputValue = editData[field] ?? '';

        return (
            <td>
                <input
                    type={type}
                    value={inputValue}
                    // ❌ ELIMINAMOS onBlur={handleEditSave} y onKeyDown={...}
                    onChange={(e) => handleEditChange(field, e.target.value)}
                    onFocus={(e) => e.target.select()} 
                    style={{ width: '100%', minWidth: '80px', padding: '4px', boxSizing: 'border-box' }}
                />
            </td>
        );
    }

    // --- Modo Visualización ---
    return (
      <td title={prod.descripcion}>
        {field === 'nombre' ? <strong>{displayValue}</strong> : null}
        {field === 'nombre' && <span style={{fontSize:'0.8em', color:'#666', display: 'block'}}>{prod.id.slice(0,8)}...</span>}
        {field === 'descripcion' ? (displayValue ? displayValue.substring(0, 30) + "..." : "-") : null}
        {field === 'presentacion' ? (displayValue || "-") : null}
        {field === 'stock' ? displayValue : null}
        {field === 'precio' ? `S/ ${displayValue}` : null}
        {field === 'categoria' ? <b>{displayValue}</b> : null}
      </td>
    );
  };
  
  // Filtrado simple por nombre (Buscador)
  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );


  return (
    <div className="product-list-table">
      {/* ... Botones de acciones de la tabla (sin cambios) ... */}

      <div className="table-actions">
        <input 
          type="text" 
          placeholder="Buscar un producto..." 
          className="search-input" 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="btn-green" onClick={cargarProductos}>Refrescar</button>
        <button className="btn-grey" onClick={() => navigate("/admin/productos/listacategorias")}>
          Categorías
        </button>
        <button className="btn-green" onClick={() => setIsModalOpen(true)}>
          Agregar producto
        </button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre / ID</th>
            <th>Presentación</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((prod) => (
            <tr key={prod.id} className={editingId === prod.id ? 'editing-row' : ''}>
              <td>
                <img
                  src={renderImagen(prod.imagen)}
                  alt={prod.nombre}
                  className="product-img"
                  onError={(e) => e.target.src = "/unknown.jpg"}
                />
              </td>
              {renderCell(prod, 'nombre')}
              {renderCell(prod, 'presentacion')}
              {renderCell(prod, 'descripcion')}
              {renderCell(prod, 'categoria')} 
              {renderCell(prod, 'stock', 'number')}
              {renderCell(prod, 'precio', 'number')}
              
              <td>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  
                  {editingId !== prod.id ? (
                      // ✏️ Botón Editar: Inicia la edición en línea
                      <button 
                          className="btn-edit" 
                          title="Editar" 
                          onClick={() => handleEditStart(prod)}
                      >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                      </button>
                  ) : (
                      <>
                        {/* 💾 Botón Guardar: Llama a handleEditSave */}
                        <button 
                            className="btn-green" 
                            title="Guardar Cambios" 
                            onClick={handleEditSave}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        </button>
                        {/* 🚫 Botón Cancelar: Aborta la edición */}
                         <button 
                            className="btn-delete" 
                            title="Cancelar Edición" 
                            onClick={handleEditCancel}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </>
                  )}
                  

                  {/* Botón Eliminar (Visible siempre, excepto en modo edición para evitar errores) */}
                  {editingId !== prod.id && (
                    <button 
                      className="btn-delete" 
                      title="Eliminar" 
                      onClick={() => handleDelete(prod.id)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a2 0 0 1 2-2h2a2 0 0 1 2 2v2" /></svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {productosFiltrados.length === 0 && (
            <tr>
              <td colSpan="8" style={{textAlign:"center", padding:"20px"}}>
                No se encontraron productos.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ProductCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductCreated={cargarProductos} 
        categorias={categorias} 
      />
    </div>
  );
};

export default ProductListTable;