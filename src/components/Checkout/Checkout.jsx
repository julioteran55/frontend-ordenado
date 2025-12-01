import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import Asside from "../asside.jsx"; 
import "./Checkout.css";

const INITIAL_FORM = {
  nombre: "", apellido: "", ciudad: "", departamento: "",
  direccion: "", postal: "", telefono: "",
};

export default function Checkout() {
  const { carrito } = useCart();
  const navigate = useNavigate();

  const items = Array.isArray(carrito) ? carrito : [];
  const totalItems = items.reduce((s, it) => s + Number(it.cantidad ?? 1), 0);
  const total = items.reduce((s, it) => s + Number(it.precio ?? 0) * Number(it.cantidad ?? 1), 0);

  // Recuperamos datos si el usuario ya los escribió antes
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("direccionEnvio");
    return saved ? JSON.parse(saved) : INITIAL_FORM;
  });
  
  const [err, setErr] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.direccion.trim()) e.direccion = "Requerido";
    if (!form.telefono.trim()) e.telefono = "Requerido";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // 1. Guardamos datos temporalmente
    localStorage.setItem("direccionEnvio", JSON.stringify(form));

    // 2. Vamos al siguiente paso
    navigate("/checkout/pago");
  };

  if (items.length === 0) {
    return <section className="checkout container" style={{padding:24}}><h2>Carrito vacío</h2></section>;
  }

  return (
    <section className="checkout container">
      <h1 className="checkout__title">Datos de Envío</h1>
      <div className="page-grid">
        <main className="main-content">
          <form className="checkout-form" onSubmit={onSubmit}>
            <h2>Dirección de envío</h2>
            <div className="grid2">
               <div className="field">
                 <label>Nombre</label>
                 <input name="nombre" value={form.nombre} onChange={onChange} />
                 {err.nombre && <small className="err">{err.nombre}</small>}
               </div>
               <div className="field">
                 <label>Apellido</label>
                 <input name="apellido" value={form.apellido} onChange={onChange} />
               </div>
            </div>
            <div className="field">
                 <label>Dirección</label>
                 <input name="direccion" value={form.direccion} onChange={onChange} placeholder="Calle y número..." />
                 {err.direccion && <small className="err">{err.direccion}</small>}
            </div>
            <div className="grid2">
               <div className="field">
                 <label>Ciudad</label>
                 <input name="ciudad" value={form.ciudad} onChange={onChange} />
               </div>
               <div className="field">
                 <label>Teléfono</label>
                 <input name="telefono" value={form.telefono} onChange={onChange} />
                 {err.telefono && <small className="err">{err.telefono}</small>}
               </div>
            </div>
          </form>
        </main>
        <Asside totalItems={totalItems} totalPrecio={total} buttonText="Ir a Pagar" onAction={onSubmit} />
      </div>
    </section>
  );
}