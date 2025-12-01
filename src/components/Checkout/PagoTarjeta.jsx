import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { crearOrden, pagarOrden } from "../../api/ordenes.js"; // CONECTADO A TU API
import Asside from "../asside.jsx";
import "./Checkout.css";
import visaCard from "../../assets/Tarjeta.gif";

export default function PaymentCardPage() {
  const navigate = useNavigate();
  const { carrito, vaciarCarrito } = useCart();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const items = Array.isArray(carrito) ? carrito : [];
  const totalItems = items.reduce((s, it) => s + Number(it.cantidad ?? 1), 0);
  const total = items.reduce((s, it) => s + Number(it.precio ?? 0) * Number(it.cantidad ?? 1), 0);

  const [form, setForm] = useState({ nombre: "", numero: "", expiracion: "", cvv: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones básicas de formulario
    if (!form.nombre || !form.numero || !form.expiracion || !form.cvv) {
      alert("Completa todos los campos"); return;
    }
    // Validación de usuario
    if (!user) {
      alert("Debes iniciar sesión"); navigate("/login"); return;
    }

    try {
        setLoading(true);

        // 1. Recuperar datos de envío guardados en el paso anterior
        const dirJson = JSON.parse(localStorage.getItem("direccionEnvio") || "{}");
        const direccionString = `${dirJson.direccion}, ${dirJson.ciudad} (${dirJson.nombre} ${dirJson.apellido}) - Tel: ${dirJson.telefono}`;

        console.log("💳 Procesando tarjeta...");

        // 2. CREAR ORDEN EN EL BACKEND
        const respuesta = await crearOrden({
            direccionEnvio: direccionString,
            metodoPago: "TARJETA"
        });

        // 3. RECUPERAR ID (Corrección para tu estructura de respuesta)
        // Tu backend devuelve: { orden: { id: "..." } }
        const idReal = respuesta.orden ? respuesta.orden.id : null; 

        if (idReal) {
            console.log("✅ ID detectado:", idReal);
            
            // 4. MARCAR COMO PAGADA
            // Simulamos que la pasarela de tarjeta aprobó el pago
            await pagarOrden(idReal);
            console.log("✅ Pago registrado en backend");
        } else {
            console.error("❌ No se encontró el ID de la orden en la respuesta");
        }

        // 5. GUARDAR RESUMEN PARA PANTALLA FINAL
        const orderParaMostrar = {
            items, 
            total, 
            direccion: dirJson, 
            idOrdenBackend: idReal
        };
        localStorage.setItem("lastOrder", JSON.stringify(orderParaMostrar));

        // 6. LIMPIAR Y REDIRIGIR
        await vaciarCarrito();
        localStorage.removeItem("direccionEnvio");

        navigate("/checkout/completado");

    } catch (error) {
        console.error("Error pago tarjeta:", error);
        alert("Pago rechazado o error de conexión.");
    } finally {
        setLoading(false);
    }
  };
  
  return (
    <section className="checkout container">
      <h1 className="checkout__title">Pago con Tarjeta</h1>
      <div className="page-grid">
        <main className="main-content">
          <img src={visaCard} alt="Tarjeta" className="card-image" style={{marginBottom:20}} />
          <form className="card-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Titular</label>
              <input name="nombre" value={form.nombre} onChange={onChange} />
            </div>
            <div className="field">
              <label>Número</label>
              <input name="numero" maxLength="19" value={form.numero} onChange={onChange} />
            </div>
            <div className="grid2">
              <div className="field">
                <label>Vencimiento</label>
                <input name="expiracion" placeholder="MM/AA" value={form.expiracion} onChange={onChange} />
              </div>
              <div className="field">
                <label>CVV</label>
                <input name="cvv" type="password" maxLength="3" value={form.cvv} onChange={onChange} />
              </div>
            </div>
            <button type="submit" className="btn-green" disabled={loading} style={{marginTop:20, width:"100%"}}>
                {loading ? "Procesando..." : "Pagar Ahora"}
            </button>
          </form>
        </main>
        <Asside 
            totalItems={totalItems} 
            totalPrecio={total} 
            buttonText={loading ? "Procesando..." : "Pagar Ahora"} 
            onAction={handleSubmit} 
        />
      </div>
    </section>
  );
}