import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerProductos, eliminarProducto } from "../api/productos"; // Importamos la API
import "./ProductListTable.css";

const ProductListTable = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Función para cargar datos
  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando tabla:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Función para eliminar producto real
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) {
      try {
        await eliminarProducto(id);
        alert("Producto eliminado correctamente");
        // Recargamos la lista para que desaparezca de la tabla
        cargarProductos();
      } catch (error) {
        console.error(error);
        alert("Hubo un error al eliminar (¿Tienes permisos de administrador?)");
      }
    }
  };

  // Función auxiliar para renderizar imagen segura
  const renderImagen = (imgUrl) => {
    if (!imgUrl) return "/unknown.jpg";
    return (imgUrl.startsWith("http") || imgUrl.startsWith("/")) ? imgUrl : `/${imgUrl}`;
  };

  // Filtrado simple por nombre (Buscador)
  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="product-list-table">
      <h2>Listado de productos (Base de Datos)</h2>
      
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
        <button className="btn-green" onClick={() => navigate("/admin/crear-producto")}>
          Agregar producto
        </button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
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
            <tr key={prod.id}>
              <td>
                 <img
                    src={renderImagen(prod.imagen)}
                    alt={prod.nombre}
                    className="product-img"
                    onError={(e) => e.target.src = "/unknown.jpg"}
                  />
              </td>
              <td>
                 <strong>{prod.nombre}</strong>
                 <br/><span style={{fontSize:'0.8em', color:'#666'}}>{prod.id.slice(0,8)}...</span>
              </td>
              <td>{prod.presentacion || "-"}</td>
              <td title={prod.descripcion}>
                {prod.descripcion ? prod.descripcion.substring(0, 30) + "..." : "-"}
              </td>
              <td>
                {/* Manejo seguro de categoría si viene como objeto o string */}
                <b>{typeof prod.categoria === 'object' ? prod.categoria?.nombre : prod.categoria}</b>
              </td>
              <td>{prod.stock}</td>
              <td>S/ {prod.precio}</td>
              <td>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  
                  {/* Botón Editar - Navega a la ruta de edición con el ID */}
                  <button 
                    className="btn-edit" 
                    title="Editar" 
                    onClick={() => navigate(`/admin/editar-producto/${prod.id}`)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                  </button>

                  {/* Botón Eliminar - Llama a la API */}
                  <button 
                    className="btn-delete" 
                    title="Eliminar" 
                    onClick={() => handleDelete(prod.id)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>
                  </button>
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
    </div>
  );
};

export default ProductListTable;