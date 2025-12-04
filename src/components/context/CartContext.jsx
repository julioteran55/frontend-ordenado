import { createContext, useContext, useState, useEffect } from "react";

// OJO AQUI: Verifica si es "../api/carrito" o "../api/carritoApi"
// Solo usa un "../" porque "context" y "api" están al mismo nivel en "src"
import { 
  obtenerCarrito, 
  agregarItemAlCarrito, 
  eliminarItemDelCarrito, 
  vaciarCarrito as vaciarCarritoApi 

} from "../../api/carrito.js"; 
import { actualizarCantidadItemCarrito } from "../../api/carrito.js";

const CartContext = createContext();


export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. CARGAR DATOS (GET)
  const recargarCarrito = async () => {
    try {
      setLoading(true);
      const data = await obtenerCarrito();
      
      console.log("📥 Datos del carrito recibidos:", data); // LOG NUEVO

      // Validación por si el backend devuelve algo raro
      const itemsApi = data.items_carritos || [];
      
      const carritoFormateado = itemsApi.map(item => ({
        ...item.producto,
        cantidad: item.cantidad,
        id: item.producto.id,        // id del producto
        carritoItemId: item.id       // 🔥 id REAL del item en el carrito
      }));

      setCarrito(carritoFormateado);
    } catch (error) {
      console.error("❌ Error cargando carrito:", error);
      setCarrito([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    recargarCarrito();
  }, []);

  // 2. AGREGAR (CON LOGS PARA DEPURAR)
  const agregarAlCarrito = async (producto) => {
    try {
      console.log("🛒 Context: Recibí orden de agregar:", producto);

      if (!producto.id) {
          alert("Error: El producto no tiene ID");
          return;
      }

      console.log("📡 Enviando al API el ID:", producto.id);
      
      // Llamada al Backend
      await agregarItemAlCarrito(producto.id);
      
      console.log("✅ API respondió OK. Recargando lista...");
      await recargarCarrito(); 

      alert("¡Producto agregado exitosamente!");

    } catch (error) {
      console.error("❌ Error FATAL al agregar:", error);
      alert("Error al agregar. ¿Estás logueado?");
    }
  };

  // ... (El resto de funciones eliminar, vaciar, etc. déjalas igual)
  const eliminarProducto = async (productoId) => {
  try {
    const item = carrito.find((i) => i.id === productoId);
    if (!item) return;

    await eliminarItemDelCarrito(item.carritoItemId); // DELETE usando id REAL del carrito
    await recargarCarrito();

  } catch (error) {
    console.error("❌ Error eliminando item:", error);
  }
};

  const vaciarCarrito = async () => {
    try {
      await vaciarCarritoApi();
      setCarrito([]); 
    } catch (error) { console.error(error); }
  };
  
  // Actualiza la cantidad de un item. Recibe (id, delta)
  const actualizarCantidad = async (productoId, delta) => {
  try {
    const item = carrito.find(i => i.id === productoId);
    if (!item) return;

    const nuevaCantidad = Math.max(1, item.cantidad + delta);

    await actualizarCantidadItemCarrito(item.carritoItemId, nuevaCantidad); 
    await recargarCarrito();

  } catch (error) {
    console.error("❌ Error actualizando cantidad:", error);
  }
};

  return (
    <CartContext.Provider 
      value={{ 
        carrito, 
        agregarAlCarrito, 
        eliminarProducto, 
        actualizarCantidad, 
        vaciarCarrito,
        loading 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);