import React, { useEffect, useState } from "react";
import { verUsuario } from "../../api/usuarios.js";
import { obtenerOrdenesPorUsuarioId } from "../../api/ordenes.js"

function AdminUserDetail({ user, users = [], onChangeUser }) {
  const [detalle, setDetalle] = useState(null);
  const [ordenesUsuario, setOrdenesUsuario] = useState([]);

  // paginación de órdenes del usuario
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPageSize = 4;

  // modal de detalle de orden
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setDetalle(null);
      setOrdenesUsuario([]);
      setOrdersPage(1);
      return;
    }

    let isMounted = true;

    async function fetchDetalle() {
      try {
        const id = user.id || user.idUsuario;
        if (!id) return;

        const data = await verUsuario(id);
        if (!isMounted) return;
        setDetalle(data);

        const ords = await obtenerOrdenesPorUsuarioId(id);
        if (!isMounted) return;
        const lista = Array.isArray(ords) ? ords : ords?.content || [];
        setOrdenesUsuario(lista);
        setOrdersPage(1); // al cambiar de usuario, volvemos a la primera página
      } catch (error) {
        console.error("Error cargando detalle del usuario:", error);
      }
    }

    fetchDetalle();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!user) {
    return (
      <section className="admin-user-detail empty">
        <h3>Detalle del usuario</h3>
        <p>Selecciona un usuario para ver su detalle.</p>
      </section>
    );
  }

  const info = detalle || user;

  const avatarSrc =
    info.photo || info.avatar || "/unknown.jpg";

  const nombre =
    (info.nombre && info.apellido
      ? `${info.nombre} ${info.apellido}`
      : info.name) || "Usuario";

  const index = users.findIndex(
    (u) => u && info && (u.id || u.idUsuario) === (info.id || info.idUsuario)
  );
  const current = index >= 0 ? index : 0;

  const goTo = (i) => {
    const ni = Math.max(0, Math.min(users.length - 1, i));
    if (onChangeUser && users[ni]) onChangeUser(users[ni]);
  };

  // cálculo de paginación para órdenes
  const totalOrdersPages = Math.max(
    1,
    Math.ceil(ordenesUsuario.length / ordersPageSize)
  );

  const pagedOrders = ordenesUsuario.slice(
    (ordersPage - 1) * ordersPageSize,
    ordersPage * ordersPageSize
  );

  // handlers modal
  const handleOpenOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  return (
    <section className="admin-user-detail">
      <h3>Detalle del usuario</h3>
      <div className="detalle-card">
        <div className="detalle-info">
          <h4>{nombre}</h4>
          <div className="user-avatar-wrap">
            <img
              src={avatarSrc}
              alt={`${nombre} avatar`}
              className="user-avatar"
            />
          </div>
          <p>Correo: {info.correo || info.email}</p>
          <p>Estado: {info.estado || info.status}</p>
          <p>Tipo de usuario: {info.tipoUsuario || info.role || "-"}</p>
          {info.fechaRegistro || info.registered ? (
            <p>
              Fecha de registro: {info.fechaRegistro || info.registered}
            </p>
          ) : null}
        </div>

        <div className="detalle-orders">
          <h4>Órdenes</h4>
          <table className="tabla-ordenes-peq">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {pagedOrders.length > 0 ? (
                pagedOrders.map((o) => (
                  <tr key={o.id || o.idOrden}>
                    <td
                      className="link-id"
                      onClick={() => handleOpenOrderModal(o)}
                      style={{ cursor: "pointer" }}
                    >
                      {o.id || o.idOrden}
                    </td>
                    <td>{o.fecha || o.date || o.fechaCreacion}</td>
                    <td>S/ {Number(o.total || 0)}.00</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "8px" }}>
                    Este usuario aún no tiene órdenes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {ordenesUsuario.length > ordersPageSize && (
            <div className="user-detail-orders-paginator">
              <button
                className="page-arrow"
                onClick={() =>
                  setOrdersPage((p) => Math.max(1, p - 1))
                }
                disabled={ordersPage === 1}
              >
                &lt;
              </button>
              <span className="user-pos">
                {ordersPage} / {totalOrdersPages}
              </span>
              <button
                className="page-arrow"
                onClick={() =>
                  setOrdersPage((p) => Math.min(totalOrdersPages, p + 1))
                }
                disabled={ordersPage === totalOrdersPages}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="user-detail-paginator">
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="page-arrow"
        >
          &lt;
        </button>
        <span className="user-pos">
          {users.length > 0 ? current + 1 : 0} / {users.length}
        </span>
        <button
          onClick={() => goTo(current + 1)}
          disabled={current === users.length - 1}
          className="page-arrow"
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

            <p><strong>ID:</strong> {selectedOrder.id}</p>
            <p><strong>Fecha:</strong> {selectedOrder.fecha}</p>
            <p><strong>Estado pago:</strong> {selectedOrder.estadoPago}</p>
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

export default AdminUserDetail;
