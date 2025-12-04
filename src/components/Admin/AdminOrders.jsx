import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminOrders({ range, orders = [] }) {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [page, orders]);

  const goTo = (p) => setPage(Math.max(1, Math.min(totalPages, p)));

  const renderPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "dots", totalPages];
    if (page >= totalPages - 2)
      return [1, "dots", totalPages - 2, totalPages - 1, totalPages];
    return [1, "dots", page, "dots", totalPages];
  };

  const handleVerTodas = () => {
    navigate("/admin/ordenes");
  };

  // --- estado para el modal de detalle de orden ---
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const handleOpenOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  return (
    <section className="admin-orders">
      <div className="orders-header">
        <h3>Listado de órdenes</h3>
        <div className="orders-actions">
          <Link to="/admin/productos" className="btn-ver-productos">
            Ver productos
          </Link>
          {/* 
          <button
            onClick={handleVerTodas}
            className="btn-ver-todas"
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Ver órdenes
          </button>
          */}
        </div>
      </div>

      <table className="tabla-ordenes">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Usuario</th>
            <th>Fecha de orden</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {paged.length > 0 ? (
            paged.map((o) => (
              <tr key={o.id || o.idOrden}>
                <td
                  className="link-id"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenOrderModal(o)}
                >
                  {o.id || o.idOrden}
                </td>
                <td>{o.usuarioId || o.user || "—"}</td>
                <td>{o.fecha || o.date || o.fechaCreacion}</td>
                <td>S/ {Number(o.total || 0)}.00</td>
                <td className="estado">{o.estadoPago || o.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "12px" }}>
                No hay órdenes registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="paginator">
        <button
          className="page-arrow"
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
        >
          &lt;
        </button>

        {renderPageNumbers().map((p, idx) =>
          p === "dots" ? (
            <span key={"dots-" + idx} className="page-dots">
              …
            </span>
          ) : (
            <button
              key={p}
              className={"page" + (p === page ? " active" : "")}
              onClick={() => goTo(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className="page-arrow"
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages}
        >
          &gt;
        </button>
      </div>

      {/* MODAL DETALLE DE ORDEN */}
      {showOrderModal && selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={handleCloseOrderModal}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="order-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "16px 20px",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <h4>Detalle de la orden</h4>
              <button
                onClick={handleCloseOrderModal}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <p><strong>ID:</strong> {selectedOrder.id || selectedOrder.idOrden}</p>
            <p><strong>Usuario ID:</strong> {selectedOrder.usuarioId || "—"}</p>
            <p><strong>Fecha:</strong> {selectedOrder.fecha || selectedOrder.date || selectedOrder.fechaCreacion}</p>
            <p><strong>Estado pago:</strong> {selectedOrder.estadoPago || selectedOrder.status}</p>
            <p><strong>Dirección de envío:</strong> {selectedOrder.direccionEnvio}</p>
            <p><strong>Total:</strong> S/ {Number(selectedOrder.total || 0)}.00</p>

            <div style={{ marginTop: 10 }}>
              <strong>Productos:</strong>
              {Array.isArray(selectedOrder.productos) && selectedOrder.productos.length > 0 ? (
                <ul style={{ paddingLeft: "18px", marginTop: "6px" }}>
                  {selectedOrder.productos.map((p, idx) => (
                    <li key={idx}>
                      {p.nombre || p.nombreProducto || "Producto sin nombre"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ marginTop: "4px" }}>Esta orden no tiene productos registrados.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminOrders;
