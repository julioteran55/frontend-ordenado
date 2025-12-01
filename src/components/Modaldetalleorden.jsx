import React from "react";
import "./Modaldetalleorden.css";

function ModalOrden({ orden, onClose }) {
  if (!orden) return null;

  const productos = orden.productos || [];

  const fechaFormateada = orden.fecha
    ? new Date(orden.fecha).toLocaleString()
    : "-";

  const total = Number(orden.total || 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-contenido"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Detalles de la Orden</h2>
          <button className="btn-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* INFO GENERAL DE LA ORDEN */}
        <div className="modal-info-orden">
          <p>
            <strong>ID:</strong> {orden.id}
          </p>
          <p>
            <strong>Fecha:</strong> {fechaFormateada}
          </p>
          <p>
            <strong>Estado de pago:</strong> {orden.estadoPago}
          </p>
          <p>
            <strong>Método de pago:</strong>{" "}
            {orden.metodoPago || "-"}
          </p>
          <p>
            <strong>Dirección de envío:</strong>{" "}
            {orden.direccionEnvio}
          </p>
          <p>
            <strong>Total:</strong> ${total.toFixed(2)}
          </p>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <h3>Productos de la orden</h3>
        {productos.length === 0 ? (
          <p>Esta orden no tiene productos asociados.</p>
        ) : (
          <table className="tabla-productos-orden">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Presentación</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => {
                const cantidad = prod.ordenes_productos?.cantidad || 0;
                const precioUnit =
                  Number(
                    prod.ordenes_productos?.precioUnitario ??
                      prod.precio ??
                      0
                  );
                const subtotal = cantidad * precioUnit;

                return (
                  <tr key={prod.id}>
                    <td>
                      <div className="producto-info">
                        {prod.imagen && (
                          <img
                            src={prod.imagen}
                            alt={prod.nombre}
                            className="producto-imagen"
                          />
                        )}
                        <div>
                          <div className="producto-nombre">
                            {prod.nombre}
                          </div>
                          <div className="producto-descripcion">
                            {prod.descripcion}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{prod.presentacion}</td>
                    <td>{cantidad}</td>
                    <td>${precioUnit.toFixed(2)}</td>
                    <td>${subtotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ModalOrden;
