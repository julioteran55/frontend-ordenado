import React from "react";
import { useUser } from "../context/UserContext";
import { useOrders } from "../context/OrderContext";

function AdminSummary({ range }) {

  const { usuarios } = useUser();
  const { ordenes } = useOrders();

  const data = {
    orders: ordenes.length,
    newUsers: usuarios.length,
    revenue: ordenes.reduce((acc, order) => acc + order.total, 0),
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
