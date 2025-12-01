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

  // 3. Hook para leer los parámetros de consulta de la URL (ej: ?categoria=a9a07d60-...)
  const [searchParams] = useSearchParams();

  // 4. Cargar productos y aplicar el filtro de la URL
  useEffect(() => {
    // El filtro es el ID (UUID) de la categoría que viene del Header
    const categoriaIdFiltro = searchParams.get("categoria"); 
    
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Iniciando carga de productos...");

        // --- VERIFICACIÓN CRÍTICA DE IMPORTACIÓN ---
        if (typeof obtenerProductos !== 'function') {
            throw new Error("FATAL: La función 'obtenerProductos' no fue importada correctamente. Revisa la línea 'import { obtenerProductos }...' y el nombre de la función exportada.");
        }
        
        // Llamada a la API que DEBE traer TODOS los productos.
        const data = await obtenerProductos();
        console.log("Datos recibidos de API:", data);

        if (Array.isArray(data)) {
          setListaProductos(data); // Guarda la lista completa como maestra

          // --- LÓGICA DE FILTRADO POR ID (UUID) ---
          if (categoriaIdFiltro) {
            // Si hay un filtro ID en la URL, filtramos la lista completa
            const filtrados = data.filter(
              // *** ¡CORRECCIÓN APLICADA! ***
              // Usamos el nombre de la propiedad 'categoriaId' que nos confirmaste.
              (p) => p.categoriaId === categoriaIdFiltro
            );
            setProductosFiltrados(filtrados);
            console.log(`Filtro aplicado por ID: ${categoriaIdFiltro}. Productos encontrados: ${filtrados.length}`);
          } else {
            // Si NO hay filtro en la URL, mostramos la lista completa
            setProductosFiltrados(data);
            console.log("No hay filtro de categoría. Mostrando todos los productos.");
          }
          // --- FIN LÓGICA DE FILTRADO ---
          
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
    
    // Ejecutar la carga y el filtro
    cargarDatos();
  }, [searchParams]); // Se re-ejecuta cada vez que cambia el filtro de la URL

  // Título dinámico
  const categoriaIdActual = searchParams.get("categoria");
  // Mostramos una versión corta del UUID en el título
  const tituloPagina = categoriaIdActual 
    ? `Productos filtrados por categoría` 
    : "Todos los productos";

  if (loading) return <div style={{padding:"50px", textAlign:"center"}}><h2>Cargando productos...</h2></div>;
  
  // Si hay error, mostramos el mensaje de error con el detalle
  if (error) return <div style={{padding:"50px", color:"red", textAlign:"center"}}><h2>Error al cargar: {error}</h2><p>Revisa la consola (F12) para más detalles.</p></div>;

  return (
    <div className="productos-contenedor">
      <main className="grid-productos" style={{width: "100%"}}>
        {/* 5. Usamos el título dinámico */}
        <h2>{tituloPagina}</h2>

        {/* 6. Usamos productosFiltrados para el mapeo */}
        {productosFiltrados.length === 0 ? (
          <p>No hay productos para mostrar en esta categoría.</p>
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
                  // *** MODIFICACIÓN AQUÍ ***: Eliminamos el UUID visible.
                  // Pasa una cadena vacía. Si ProductCard necesita el nombre, deberás buscarlo.
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