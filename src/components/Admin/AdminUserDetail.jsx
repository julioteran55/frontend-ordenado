import React from "react";

function AdminUserDetail({ user, users = [], onChangeUser }) {
  if (!user) {
    return (
      <section className="admin-user-detail empty">
        <h3>Detalle del usuario</h3>
        <p>Selecciona un usuario para ver su detalle.</p>
      </section>
    );
  }

  // Example list of orders for the user
  const orders = [
    { id: '#1234', date: '20/01/2025', total: 199 },
    { id: '#1237', date: '21/01/2025', total: 299 },
  ];

  const avatarSrc = user.photo ? user.photo : '/unknown.jpg';

  const index = users.findIndex((u) => u && user && u.id === user.id);
  const current = index >= 0 ? index : 0;

  const goTo = (i) => {
    const ni = Math.max(0, Math.min(users.length - 1, i));
    if (onChangeUser) onChangeUser(users[ni]);
  };

  return (
    <section className="admin-user-detail">
      <h3>Detalle del usuario</h3>
      <div className="detalle-card">
        <div className="detalle-info">
          <h4>{user.name}</h4>
          <div className="user-avatar-wrap">
            <img src={avatarSrc} alt={`${user.name} avatar`} className="user-avatar" />
          </div>
          <p>Correo: {user.email}</p>
          <p>Fecha de registro: {user.registered}</p>
          <p>Estado: {user.status}</p>
        </div>
        <div className="detalle-orders">
          <h4>Órdenes</h4>
          <table className="tabla-ordenes-peq">
            <thead>
              <tr><th>#ID</th><th>Fecha</th><th>Total</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}><td className="link-id">{o.id}</td><td>{o.date}</td><td>S/ {o.total}.00</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="user-detail-paginator">
        <button onClick={() => goTo(current - 1)} disabled={current === 0} className="page-arrow">&lt;</button>
        <span className="user-pos">{current + 1} / {users.length}</span>
        <button onClick={() => goTo(current + 1)} disabled={current === users.length - 1} className="page-arrow">&gt;</button>
      </div>
    </section>
  );
}

export default AdminUserDetail;
