import { useState, useEffect } from "react";
// IMPORTANTE: Según tu foto, el archivo se llama "productos.js" (singular)
import { obtenerProductos } from "../api/productos.js"; 
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import "./Productos.css";



function Productos() {
  // 1. Estado para guardar la lista maestra de productos, sin filtrar.
  const [listaProductos, setListaProductos] = useState([]); 
  // 2. Estado para guardar la lista que se va a renderizar (filtrada o completa).
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Hook para leer los parámetros de consulta de la URL (ej: ?categoria=... o ?q=...)
  const [searchParams] = useSearchParams();

  // 4. Cargar productos y aplicar los filtros de la URL
  useEffect(() => {
    // Leer los dos posibles filtros de la URL
    const categoriaIdFiltro = searchParams.get("categoria"); 
    const terminoBusqueda = searchParams.get("q"); // Nuevo parámetro de búsqueda
    
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Iniciando carga de productos...");

        if (typeof obtenerProductos !== 'function') {
            throw new Error("FATAL: La función 'obtenerProductos' no fue importada correctamente.");
        }
        
        // Llamada a la API que DEBE traer TODOS los productos.
        const data = await obtenerProductos();

        if (Array.isArray(data)) {
          setListaProductos(data); // Guarda la lista completa como maestra
          let resultadoFiltrado = data;

          // --- 1. LÓGICA DE FILTRADO POR CATEGORÍA (UUID) ---
          if (categoriaIdFiltro) {
            resultadoFiltrado = resultadoFiltrado.filter(
              // Usamos la propiedad 'categoriaId' confirmada por el usuario.
              (p) => p.categoriaId === categoriaIdFiltro
            );
            console.log(`Filtro aplicado por ID de Categoría: ${categoriaIdFiltro}. Productos restantes: ${resultadoFiltrado.length}`);
          }
          
          // --- 2. LÓGICA DE FILTRADO POR TÉRMINO DE BÚSQUEDA ---
          if (terminoBusqueda) {
            const query = terminoBusqueda.toLowerCase().trim();
            resultadoFiltrado = resultadoFiltrado.filter(
              // Filtra si el nombre del producto incluye el término de búsqueda
              (p) => p.nombre && p.nombre.toLowerCase().includes(query)
            );
            console.log(`Filtro aplicado por Búsqueda: "${terminoBusqueda}". Productos restantes: ${resultadoFiltrado.length}`);
          }

          // Asignar el resultado final de los filtros
          setProductosFiltrados(resultadoFiltrado);
          
        } else {
          console.error("La API no devolvió un array:", data);
          setListaProductos([]);
          setProductosFiltrados([]);
          setError("La respuesta del servidor no es una lista de productos válida."); 
        }

      } catch (err) {
        console.error("Error fatal cargando productos:", err);
        setError(`Error: ${err.message || "No se pudo conectar con el servidor o cargar los productos."}`);
        setListaProductos([]);
        setProductosFiltrados([]);
      } finally {
        setLoading(false);
      }
    };
    
    // El efecto se ejecuta si cambia cualquier parámetro de la URL
    cargarDatos();
  }, [searchParams]); 

  // Título dinámico
  const categoriaIdActual = searchParams.get("categoria");
  const terminoBusquedaActual = searchParams.get("q");
  
  let tituloPagina = "Todos los productos";
  if (terminoBusquedaActual) {
    tituloPagina = `Resultados para: "${terminoBusquedaActual}"`;
  } else if (categoriaIdActual) {
    // Si hay filtro de categoría, pero no de búsqueda, mostramos el ID de la categoría (reducido)
    tituloPagina = `Productos filtrados`;
  }


  if (loading) return <div style={{padding:"50px", textAlign:"center"}}><h2>Cargando productos...</h2></div>;
  
  if (error) return <div style={{padding:"50px", color:"red", textAlign:"center"}}><h2>Error al cargar: {error}</h2><p>Revisa la consola (F12) para más detalles.</p></div>;

  return (
    <div className="productos-contenedor">
      <main className="grid-productos" style={{width: "100%"}}>
        <h2>{tituloPagina}</h2>

        {productosFiltrados.length === 0 ? (
          <p>No hay productos para mostrar con los filtros aplicados.</p>
        ) : (
          <div className="grid">
            {productosFiltrados.map((p) => {
              if (!p || p.id === undefined || p.id === null) {
                console.error("Producto inválido encontrado (sin ID):", p);
                return null; 
              }
              
              return (
                <ProductCard
                  key={p.id}  
                  id={p.id}
                  nombre={p.nombre}
                  // Ya no se imprime el UUID en el card
                  categoria={""} 
                  precio={p.precio}
                  imagen={p.imagen}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Productos;