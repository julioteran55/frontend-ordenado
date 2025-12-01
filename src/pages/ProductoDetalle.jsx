import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerProductos } from "../api/productos"; 
import ProductCard from "../components/ProductCard";
import "./ProductoDetalle.css";
import { useCart } from "../components/context/CartContext.jsx";
function ProductoDetalle() {
  const { id } = useParams();
  const { agregarAlCarrito } = useCart(); // Usamos la función conectada a la API
  
  const [producto, setProducto] = useState(null);
  const [similares, setSimilares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchProducto = async () => {
          try {
              // Obtenemos todos los productos del backend
              const data = await obtenerProductos();
              
              if (Array.isArray(data)) {
                  // Buscamos el producto actual comparando IDs (como strings por seguridad)
                  const encontrado = data.find(p => String(p.id) === String(id));
                  setProducto(encontrado);

                  // Filtramos productos de la misma categoría para "Similares"
                  if (encontrado) {
                      const filtrados = data.filter(p => 
                          p.categoria === encontrado.categoria && String(p.id) !== String(id)
                      );
                      setSimilares(filtrados);
                  }
              }
          } catch (error) {
              console.error("Error buscando detalle:", error);
          } finally {
              setLoading(false);
          }
      };
      fetchProducto();
  }, [id]);

  // ESTA FUNCIÓN ES LA CLAVE
  const handleAgregar = async () => {
    if (!producto) return;

    // Verificación de Login rápida (opcional, el context ya valida, pero mejora la UX)
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Debes iniciar sesión para comprar 🛒");
        return;
    }

    // Preparamos la imagen (si es http o local)
    const imgPath = producto.imagen && (producto.imagen.startsWith("http") || producto.imagen.startsWith("/")) 
            ? producto.imagen 
            : `/${producto.imagen}`;

    // Llamamos al Context (que llama a la API)
    await agregarAlCarrito({
      ...producto,
      imagen: imgPath
    });
  };

  if (loading) return <div className="detalle-container"><p>Cargando detalle...</p></div>;

  if (!producto) {
    return (
      <div className="detalle-container">
        <h2>Producto no encontrado</h2>
        <button onClick={() => window.history.back()}>Volver</button>
      </div>
    );
  }

  // Renderizado seguro de imagen principal
  const mainImage = producto.imagen 
    ? (producto.imagen.startsWith("http") || producto.imagen.startsWith("/") ? producto.imagen : `/${producto.imagen}`)
    : "/placeholder.png";

  return (
    <div className="detalle-container">
        <div className="detalle-producto">
          <img
            src={mainImage}
            alt={producto.nombre}
            className="detalle-imagen"
            onError={(e) => e.target.src = "/placeholder.png"}
          />

          <div className="detalle-info">
            <h2>{producto.nombre}</h2>
            {/* Manejo seguro si categoría es objeto o string */}
            <p className="detalle-categoria">
                {typeof producto.categoria === 'object' ? producto.categoria.nombre : producto.categoria}
            </p>
            <p className="detalle-descripcion">{producto.descripcion}</p>
            <p className="detalle-precio">S/ {Number(producto.precio).toFixed(2)}</p>
            <p className="detalle-stock">Stock: {producto.stock}</p>
            
            {/* BOTÓN CONECTADO AL API */}
            <button className="detalle-boton" onClick={handleAgregar}>
                Agregar al carrito
            </button>
          </div>
        </div>

        {similares.length > 0 && (
          <div className="similares-container">
            <h3>Productos similares</h3>
            <div className="similares-grid">
              {similares.slice(0, 4).map((item) => (
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    nombre={item.nombre}
                    categoria={item.categoria}
                    precio={item.precio}
                    imagen={item.imagen} 
                  />
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

export default ProductoDetalle;