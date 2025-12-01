import React from "react";
import "../components/asside.css";

const Asside = ({ totalItems = 0, totalPrecio = 0, buttonText = "Continuar", onAction }) => {
  const items = Number(totalItems || 0);
  const total = Number(totalPrecio || 0);

  return (
    <aside className="cart-summary">
      <h2 className="summary-title">Resumen de la compra</h2>

      <div className="summary-row">
        <span>Productos ({items})</span>
        <span>S/ {total.toFixed(2)}</span>
      </div>

      <div className="summary-row">
        <span>Delivery</span>
        <span className="green">GRATIS</span>
      </div>

      <div className="summary-row">
        <span>Descuentos</span>
        <span className="red">- S/ 0.00</span>
      </div>

      <hr />

      <div className="summary-row total">
        <strong>Total</strong>
        <strong>S/ {total.toFixed(2)}</strong>
      </div>

      {onAction && (
        <button className="btn-green" onClick={onAction}>
          {buttonText}
        </button>
      )}
    </aside>
  );
};

export default Asside;