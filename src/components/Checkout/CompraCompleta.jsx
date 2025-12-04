import React, { useEffect, useState } from "react";
import Asside from "../asside.jsx";
import "./Checkout.css";
export default function CheckoutCompleted() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("lastOrder");
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  if (!order) {
    return (
      <section className="checkout container" style={{ padding: 24, textAlign:"center" }}>
        <h1>Orden no encontrada</h1>
        <button className="btn-green" onClick={() => window.location.href = "/productos"}>Volver</button>
      </section>
    );
  }

  const { items = [], total = 0, direccion = {} } = order;
  const totalItems = items.reduce((s, it) => s + (it.cantidad ?? 1), 0);

  return (
    <section className="checkout container">
      <h1 className="checkout__title" style={{color:"#27ae60"}}>¡Gracias por tu compra! 🎉</h1>
      <p>Hemos recibido tu pedido correctamente.</p>

      <div className="page-grid">
        <main className="main-content">
          <h2>Resumen</h2>
          <div className="order-summary">
            {items.map((it) => (
              <div key={it.id || Math.random()} className="order-item">
                
                {/* Imagen del producto: usar `it.imagen` si existe, si no usar placeholder.
                    Añadimos onError para reemplazar por placeholder si la URL falla. */}
                <img
                  src={it.imagen || it.image || "https://via.placeholder.com/80.png?text=IMG"}
                  alt={it.nombre || "Producto"}
                  className="order-item__img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://via.placeholder.com/80.png?text=IMG";
                  }}
                />



                <div className="order-item__info">
                  <h3>{it.nombre}</h3>
                  <p>{typeof it.categoria === 'object' ? it.categoria?.nombre : (it.categoria || "General")}</p>
                </div>
                <div className="order-item__precio">S/ {(Number(it.precio) * (it.cantidad ?? 1)).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </main>

        <div className="checkout-aside">
          <Asside totalItems={totalItems} totalPrecio={total} buttonText="Seguir Comprando" onAction={() => window.location.href = "/productos"} />
          <div className="direccion-box" style={{marginTop: 20, padding: 15, background: "#f9f9f9"}}>
            <h3>Enviando a:</h3>
            <p><strong>{direccion.nombre} {direccion.apellido}</strong></p>
            <p>{direccion.direccion}</p>
            <p>Tel: {direccion.telefono}</p>
          </div>
        </div>
      </div>
    </section>
  );
}