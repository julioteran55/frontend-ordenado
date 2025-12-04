import React, { useEffect, useState } from "react";
import { verUsuario } from "../../api/usuarios.js";
// import { obtenerOrdenesPorUsuarioId } from "../../api/ordenesApi"; // TODO: crear endpoint y descomentar

function AdminUserDetail({ user, users = [], onChangeUser }) {
  const [detalle, setDetalle] = useState(null);
  const [ordenesUsuario, setOrdenesUsuario] = useState([]);

  useEffect(() => {
    if (!user) {
      setDetalle(null);
      setOrdenesUsuario([]);
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

        // TODO: descomentar cuando implementes obtenerOrdenesPorUsuarioId en ordenesApi.js
        /*
        const ords = await obtenerOrdenesPorUsuarioId(id);
        if (!isMounted) return;
        const lista =
          Array.isArray(ords) ? ords : ords?.content || [];
        setOrdenesUsuario(lista);
        */
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
              {ordenesUsuario.length > 0 ? (
                ordenesUsuario.map((o) => (
                  <tr key={o.id || o.idOrden}>
                    <td className="link-id">{o.id || o.idOrden}</td>
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
    </section>
  );
}

export default AdminUserDetail;
