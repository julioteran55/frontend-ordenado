import React, { useEffect, useState } from "react";
import { obtenerProductos } from "../api/productos"; // Ajusta la ruta a tu api
import ProductCard from "./ProductCard";
import "./ProductList.css";

function ProductList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await obtenerProductos();
        // Si la API devuelve un array, lo usamos. Si no, array vacío.
        setProductos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Tomamos los primeros 5 productos reales
  const topProductos = productos.slice(0, 5);

  if (loading) return <p style={{textAlign: "center"}}>Cargando ofertas...</p>;

  return (
    <section className="mas-vendido">
      <h2>Lo más vendido</h2>
      <div className="productos">
        {topProductos.map((producto) => (
          <ProductCard
            key={producto.id}
            id={producto.id}
            nombre={producto.nombre}
            categoria={producto.categoria}
            precio={producto.precio}
            imagen={producto.imagen}
          />
        ))}
        
        {topProductos.length === 0 && <p>No hay productos destacados aún.</p>}
      </div>
    </section>
  );
}

export default ProductList;