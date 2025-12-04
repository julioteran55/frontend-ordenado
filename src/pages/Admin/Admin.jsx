import React, { useState, useEffect } from "react";
import "../../components/Admin/AdminDashboard.css";
import AdminSummary from "../../components/Admin/AdminSummary";
import AdminUsers from "../../components/Admin/AdminUsers";
import AdminUserDetail from "../../components/Admin/AdminUserDetail";
import AdminOrders from "../../components/Admin/AdminOrders";
import DateRangePicker from "../../components/DateRangePicker";

import { listarUsuarios, actualizarUsuario } from "../../api/usuarios.js";
// import { listarOrdenes } from "../../api/ordenesApi"; // TODO: crear y descomentar cuando exista el endpoint

function Admin() {
  const today = new Date().toISOString().slice(0, 10);
  const [range, setRange] = useState({ from: today, to: today });

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Carga inicial de usuarios (y futuro: órdenes)
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const dataUsuarios = await listarUsuarios();
        if (!isMounted) return;

        const lista =
          Array.isArray(dataUsuarios) ? dataUsuarios : dataUsuarios?.content || [];

        setUsers(lista);

        // TODO: descomentar cuando exista listarOrdenes en ordenesApi y en backend
        // const dataOrdenes = await listarOrdenes();
        // if (!isMounted) return;
        // const listaOrdenes =
        //   Array.isArray(dataOrdenes) ? dataOrdenes : dataOrdenes?.content || [];
        // setOrders(listaOrdenes);
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Usuario seleccionado por defecto
  useEffect(() => {
    if (!selectedUser && users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  // Toggle activar/inactivar usuario (usa actualizarUsuario)
  const handleToggleUserEstado = async (usuario) => {
    if (!usuario) return;

    const id = usuario.id || usuario.idUsuario;
    if (!id) return;

    const estadoActual = usuario.estado || (usuario.active ? "activo" : "inactivo");
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo";

    try {
      const body = { ...usuario, estado: nuevoEstado };

      const actualizado = await actualizarUsuario(id, body);
      const usuarioActualizado = actualizado || { ...usuario, estado: nuevoEstado };

      setUsers((prev) =>
        prev.map((u) =>
          (u.id || u.idUsuario) === id ? { ...u, ...usuarioActualizado } : u
        )
      );

      setSelectedUser((prev) =>
        prev && (prev.id || prev.idUsuario) === id
          ? { ...prev, ...usuarioActualizado }
          : prev
      );
    } catch (error) {
      console.error("Error actualizando estado del usuario:", error);
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-top">
        <h2>Dashboard</h2>
        <DateRangePicker range={range} onChange={setRange} />
      </div>

      {/* Dashboard: total usuarios, órdenes, ingresos */}
      <AdminSummary range={range} users={users} orders={orders} />

      <div className="admin-panels">
        <div className="users-detail-row">
          <AdminUsers
            range={range}
            users={users}
            onSelectUser={setSelectedUser}
            onToggleEstado={handleToggleUserEstado}
          />
          <AdminUserDetail
            user={selectedUser}
            users={users}
            onChangeUser={setSelectedUser}
          />
        </div>

        <AdminOrders range={range} orders={orders} />
      </div>
    </main>
  );
}

export default Admin;

