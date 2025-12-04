import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
// Se elimina la importación de un archivo de datos local: import categorias from "../data/categorias.js";

// 1. Importar la función para obtener categorías
// *** ATENCIÓN: AJUSTA ESTA RUTA SI EL ARCHIVO categoriasApi.js ESTÁ EN OTRO LUGAR ***
// Si tu componente Header está en src/components/, y tu API está en src/api/, la ruta es correcta.
// Si no funciona, prueba con rutas alternativas como './api/categoriasApi' o 'api/categoriasApi' (si es un alias).
import { obtenerCategorias } from "../api/categoria"; 

import "./Header.css";
import { useUser } from "../components/context/UserContext";
import imgcarrito from "../assets/carritoimagen.png";
import { useCart } from "../components/context/CartContext.jsx";
function Header() {
  const { carrito } = useCart();
  const totalProductos = carrito.reduce((total, producto) => total + (producto.cantidad ?? 1), 0);
  
  // 2. Añadir estados para categorías y carga
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [mostrarMenu, setMostrarMenu] = useState(false);
  
  // *** NUEVO ESTADO PARA EL TÉRMINO DE BÚSQUEDA ***
  const [searchTerm, setSearchTerm] = useState(""); 

  const navigate = useNavigate();
  const { user, logout } = useUser();

  // 3. Hook para cargar las categorías al montar el componente
  useEffect(() => {
    const cargarCategoriasMenu = async () => {
      try {
        setLoading(true);
        // Llamada a la API
        const data = await obtenerCategorias(); 
        
        // Verifica que la respuesta sea un arreglo, si no lo es, asume que está vacía.
        if (Array.isArray(data)) {
          setCategorias(data);
        } else {
          console.error("La API de categorías no devolvió un arreglo o devolvió un formato inesperado:", data);
          setCategorias([]); // Asegura que el estado sea un arreglo vacío para no crashear
        }
      } catch (error) {
        // En caso de fallo de la red o API, solo loguea el error y permite la renderización.
        console.error("Error al cargar categorías para el menú:", error);
        setCategorias([]); // Asegura que el estado sea un arreglo vacío
      } finally {
        setLoading(false);
      }
    };
    cargarCategoriasMenu();
  }, []); // El array vacío asegura que se ejecute solo al montar

  const alternarMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  // Función para navegar y filtrar por ID de categoría
  const seleccionarCategoria = (id) => {
    setMostrarMenu(false);
    // Esta línea envía el ID (UUID) a la URL: /productos?categoria=a9a07d60-...
    navigate(`/productos?categoria=${encodeURIComponent(id)}`);
    setSearchTerm(""); // Limpia la búsqueda anterior si se selecciona una categoría
  };

  // *** FUNCIÓN: MANEJAR LA BÚSQUEDA ***
  const handleSearch = (e) => {
    // Si se llama desde el evento keyPress, verificamos que sea la tecla Enter
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault(); // Evita el comportamiento por defecto (si lo hay)
      
      // Si el término de búsqueda no está vacío, navegamos con el parámetro 'q'.
      if (searchTerm.trim()) {
        // Navega a la ruta de productos con el parámetro de búsqueda 'q'
        navigate(`/productos?q=${encodeURIComponent(searchTerm.trim())}`);
        setSearchTerm(""); // Limpiar la barra de búsqueda después de navegar
      } else {
        // Si la barra está vacía, navega a la página de todos los productos
        navigate(`/productos`);
      }
    }
  };

  return (
    <header className="encabezado">
      <div className="barra-navegacion">
        <div className="logo">
          <h1 className="texto-logo">
            <Link to="/" className="logo-link">GamePlay</Link>
          </h1>
        </div>

        <div className="barra-busqueda">
          {/* *** MODIFICACIÓN DEL INPUT: AÑADIMOS ESTADO y EVENTOS *** */}
          <input 
            type="text" 
            placeholder="Buscar un producto..." 
            value={searchTerm} // 1. Vinculamos el valor al estado
            onChange={(e) => setSearchTerm(e.target.value)} // 2. Actualizamos el estado al escribir
            onKeyPress={(e) => { 
              if (e.key === 'Enter') handleSearch(e); // 3. Llamamos a la función al presionar Enter
            }}
          />
          {/* Nota: Si se añade un botón de búsqueda, se debe añadir onClick={handleSearch} al botón */}
        </div>
        
        <div className="acciones">
          <Link to="/carrito" className="boton-carrito">
            <img src={imgcarrito} alt="Carrito" className="icono-carrito" />
            <span className='counter'>{totalProductos}</span>
          </Link>
          {user ? (
            <div className="usuario-info">
              <Link to="/register/MisOrdenes" className="boton-me">
                <span className="nombre-usuario">👤 {user.nombre}</span>   
              </Link>        
              <button className="boton-logout" onClick={logout}>Cerrar sesión</button>
            </div>
          ) : (
            <a href="/login" className="boton-login">Iniciar sesión</a>
          )}
        </div>
      </div>

      <nav className="menu">
        <ul className="menu-izquierda">
          <li className="menu-categorias" onClick={alternarMenu}>
            <a href="#">Categorías {loading ? "(Cargando...)" : "▼"}</a>

            {mostrarMenu && (
              <ul className="submenu">
                {loading && (
                    <li><button className="submenu-item" disabled>Cargando categorías...</button></li>
                )}

                {!loading && categorias.length === 0 && (
                    <li><button className="submenu-item" disabled>No hay categorías</button></li>
                )}
                
                {/* Iteración sobre las categorías del estado */}
                {!loading && categorias.length > 0 && categorias.map((cat) => (
                  <li key={cat.id}>
                    <button
                      className="submenu-item"
                      // Pasamos el ID (UUID) del objeto cat
                      onClick={() => seleccionarCategoria(cat.id)}
                    >
                      {cat.nombre}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li><a href="/productos">Productos</a></li>
          <li>
          <Link to="/nosotros">Nosotros</Link>
        </li>
        </ul>

        <ul className="menu-derecha">
          <li><a href="#">Ofertas</a></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;