import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useCart } from "../../src/components/context/CartContext.jsx"; // Verifica ruta


function ProductCard({ id, nombre, categoria, precio, imagen }) {
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart(); 

  // Preparamos la ruta inicial
  const imagePath = imagen 
    ? (imagen.startsWith("http") || imagen.startsWith("/") ? imagen : `/${imagen}`)
    : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";

  // --- SOLUCIÓN AL BUCLE INFINITO ---
  const handleImageError = (e) => {
    // 1. IMPORTANTE: Anulamos el evento onError para que no se pueda volver a llamar
    e.target.onerror = null; 
    // 2. Ponemos una imagen de respaldo muy estable (Wikipedia)
    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
  };

  const verDetalle = () => {
    navigate(`/producto/${id}`);
  };

  const handleAgregar = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    console.log("🔘 Intentando agregar:", nombre);

    if (!id) {
        alert("Error: Producto sin ID");
        return;
    }

    await agregarAlCarrito({
      id,
      nombre,
      precio: Number(precio),
      imagen: imagePath
    });
  }
    
  return (
    <div className="product-card" onClick={verDetalle} style={{ cursor: "pointer" }}>
      
      <img 
        src={imagePath} 
        alt={nombre} 
        className="product-image" 
        onError={handleImageError} // Aquí llamamos a la función segura
      />

      <div className="product-info">
        <p className="product-name">{nombre}</p>
        <p className="product-category">
            {typeof categoria === 'object' ? categoria.nombre : categoria}
        </p>
        <p className="product-price">S/ {Number(precio).toFixed(2)}</p>
      </div>

      <button className="product-btn" onClick={handleAgregar}>
        Agregar
      </button>
    </div>
  );
}

export default ProductCard;