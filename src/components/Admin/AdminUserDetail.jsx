import React, { useEffect, useState } from "react";
import { verUsuario } from "../../api/usuarios.js";
import { obtenerOrdenesPorUsuarioId } from "../../api/ordenes.js";
import ModalOrden from "../Modaldetalleorden.jsx";

function AdminUserDetail({ user, users = [], onChangeUser }) {
  const [detalle, setDetalle] = useState(null);
  const [ordenesUsuario, setOrdenesUsuario] = useState([]);

  // paginación de órdenes del usuario
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPageSize = 4;

  // orden seleccionada para el modal reutilizable
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

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

  const avatarSrc = info.photo || info.avatar || "/unknown.jpg";

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

  // abrir modal con la orden seleccionada
  const handleOpenOrderModal = (order) => {
    setOrdenSeleccionada(order);
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
            <p>Fecha de registro: {info.fechaRegistro || info.registered}</p>
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
                  <td
                    colSpan="3"
                    style={{ textAlign: "center", padding: "8px" }}
                  >
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
                onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
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

      {/* Modal reutilizable para ver detalle de la orden */}
      {ordenSeleccionada && (
        <ModalOrden
          orden={ordenSeleccionada}
          onClose={() => setOrdenSeleccionada(null)}
        />
      )}
    </section>
  );
}

export default AdminUserDetail;
