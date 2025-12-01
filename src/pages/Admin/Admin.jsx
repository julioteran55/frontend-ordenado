import React, { useState } from "react";
import "../../components/Admin/AdminDashboard.css";
import AdminSummary from "../../components/Admin/AdminSummary";
import AdminUsers from "../../components/Admin/AdminUsers";
import AdminUserDetail from "../../components/Admin/AdminUserDetail";
import AdminOrders from "../../components/Admin/AdminOrders";
import DateRangePicker from "../../components/DateRangePicker";
import { useUser } from "../../components/context/UserContext";

function Admin() {
  const today = new Date().toISOString().slice(0, 10);
  const [range, setRange] = useState({ from: today, to: today });
  const { usuarios } = useUser();
  
  const users = usuarios;

  const [selectedUser, setSelectedUser] = React.useState(users[0] || null);

  return (
    <main className="admin-page">
      <div className="admin-top">
        <h2>Dashboard</h2>
        <DateRangePicker range={range} onChange={setRange} />
      </div>

      <AdminSummary range={range} />

      <div className="admin-panels">
        <div className="users-detail-row">
          <AdminUsers range={range} onSelectUser={setSelectedUser} users={users} />
          <AdminUserDetail user={selectedUser} users={users} onChangeUser={setSelectedUser} />
        </div>

        <AdminOrders range={range} />
      </div>
    </main>
  );
}

export default Admin;
