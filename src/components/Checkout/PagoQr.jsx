import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { crearOrden, pagarOrden } from "../../api/ordenes.js"; // CONECTADO A TU API
import Asside from "../asside.jsx";
import qrImage from "../../assets/qr.png";
import "./Checkout.css";

export default function PaymentQRPage() {
  const navigate = useNavigate();
  const { carrito, vaciarCarrito } = useCart();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const items = Array.isArray(carrito) ? carrito : [];
  const totalItems = items.reduce((s, it) => s + Number(it.cantidad ?? 1), 0);
  const total = items.reduce((s, it) => s + Number(it.precio ?? 0) * Number(it.cantidad ?? 1), 0);

  const handlePago = async () => {
    if (!user) {
      alert("Debes iniciar sesión");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const dirJson = JSON.parse(localStorage.getItem("direccionEnvio") || "{}");
      if(!dirJson.direccion) {
          alert("Falta información de envío");
          navigate("/checkout");
          return;
      }
      
      const direccionString = `${dirJson.direccion}, ${dirJson.ciudad} (${dirJson.nombre} ${dirJson.apellido}) - Tel: ${dirJson.telefono}`;

      console.log("1️⃣ Creando orden QR...");
      
      // 1. CREAR LA ORDEN
      const respuesta = await crearOrden({
        direccionEnvio: direccionString,
        metodoPago: "QR_YAPE"
      });

      console.log("📦 Respuesta Backend:", respuesta);

      // --- CORRECCIÓN: Búsqueda flexible del ID ---
      // Intentamos encontrar el ID en varios lugares posibles
      let idReal = null;
      if (respuesta.orden && respuesta.orden.id) {
          idReal = respuesta.orden.id;
      } else if (respuesta.id) {
          idReal = respuesta.id;
      } else if (respuesta.orderId) {
          idReal = respuesta.orderId;
      }

      if (idReal) {
          console.log("2️⃣ ID encontrado:", idReal);
          console.log("3️⃣ Pagando orden...");
          
          // 2. PAGAR LA ORDEN
          try {
            await pagarOrden(idReal);
            console.log("✅ Orden marcada como PAGADA exitosamente");
          } catch (pagarError) {
            console.error("❌ Error al marcar como pagada:", pagarError);
            // No detenemos el flujo, la orden ya existe
          }
      } else {
          console.error("❌ ERROR CRÍTICO: No se pudo extraer el ID de la respuesta", respuesta);
          alert("La orden se creó pero hubo un problema al confirmar el pago. Por favor contacta soporte.");
      }

      // Guardar resumen local
      const ordenParaMostrar = {
        items,
        total,
        direccion: dirJson,
        idOrdenBackend: idReal,
        metodoPago: "QR_YAPE" // Guardamos el método explícitamente
      };
      localStorage.setItem("lastOrder", JSON.stringify(ordenParaMostrar));

      // Limpiar y salir
      await vaciarCarrito();
      localStorage.removeItem("direccionEnvio");

      navigate("/checkout/completado");

    } catch (error) {
      console.error("Error general en pago:", error);
      alert("Hubo un error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout container">
      <h1 className="checkout__title">Pago con QR</h1>
      <div className="page-grid">
        <main className="main-content">
          <div className="qr-box" style={{textAlign:"center", padding:20, border:"1px solid #eee"}}>
            <h3>Escanear QR</h3>
            <img src={qrImage} alt="QR" className="qr-image" style={{maxWidth: 200}} />
            <p className="qr-expiration">Total a pagar: <strong>S/ {total.toFixed(2)}</strong></p>
          </div>
        </main>
        <Asside 
            totalItems={totalItems} 
            totalPrecio={total} 
            buttonText={loading ? "Procesando..." : "Ya realicé el pago"} 
            onAction={handlePago} 
        />
      </div>
    </section>
  );
}