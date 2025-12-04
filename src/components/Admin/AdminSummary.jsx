import React from "react";

function AdminSummary({ range, users = [], orders = [] }) {
  const data = {
    orders: orders.length,
    newUsers: users.length,
    revenue: orders.reduce(
      (acc, order) => acc + Number(order.total || 0),
      0
    ),
  };

  return (
    <section className="admin-summary">
      <div className="summary-card">
        <h3>Órdenes</h3>
        <div className="valor">{data.orders}</div>
      </div>
      <div className="summary-card">
        <h3>Usuarios nuevos</h3>
        <div className="valor">{data.newUsers}</div>
      </div>
      <div className="summary-card">
        <h3>Ingresos totales</h3>
        <div className="valor">S/ {data.revenue}.00</div>
      </div>
    </section>
  );
}

export default AdminSummary;
