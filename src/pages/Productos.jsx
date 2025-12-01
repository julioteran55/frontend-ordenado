import { useState, useEffect } from "react";
// IMPORTANTE: Según tu foto, el archivo se llama "productos.js" (singular)
import { obtenerProductos } from "../api/productos"; 

import ProductCard from "../components/ProductCard";
import "./Productos.css";

function Productos() {
  const [listaProductos, setListaProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar SOLO productos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        console.log("Iniciando carga de productos..."); // Mensaje para depurar

        const data = await obtenerProductos();
        console.log("Datos recibidos de API:", data); // Verás esto en la consola (F12)

        if (Array.isArray(data)) {
            setListaProductos(data);
        } else {
            console.error("La API no devolvió un array:", data);
            setListaProductos([]);
        }

      } catch (err) {
        console.error("Error fatal cargando productos:", err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading) return <div style={{padding:"50px", textAlign:"center"}}><h2>Cargando productos...</h2></div>;
  
  if (error) return <div style={{padding:"50px", color:"red", textAlign:"center"}}><h2>Error: {error}</h2></div>;

  return (
    <div className="productos-contenedor">
        <main className="grid-productos" style={{width: "100%"}}> {/* width 100% porque quitamos el aside */}
          <h2>Todos los productos (sin categorías)</h2>

          {listaProductos.length === 0 ? (
              <p>No hay productos para mostrar (La lista llegó vacía).</p>
          ) : (
              <div className="grid">
                {listaProductos.map((p) => (
                  <ProductCard
                    key={p.id}   
                    id={p.id}
                    nombre={p.nombre}
                    categoria={p.categoria || "General"} 
                    precio={p.precio}
                    imagen={p.imagen}
                  />
                ))}
              </div>
          )}
        </main>
    </div>
  );
}

export default Productos;