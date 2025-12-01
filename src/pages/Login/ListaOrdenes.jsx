import React, { useState } from "react";

function ListaOrdenes() {
  const ordenes = [
    { id: "#1234", usuario: "Juan Perez", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1234", usuario: "María Gonzales", fecha: "20/01/2025", total: 199, estado: "Por entregar" },
    { id: "#1234", usuario: "Marco Aurelio", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1234", usuario: "Ana Dias", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1234", usuario: "Juan Perez", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1234", usuario: "María Gonzales", fecha: "20/01/2025", total: 199, estado: "Por entregar" },
    { id: "#1234", usuario: "Marco Aurelio", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1234", usuario: "Ana Dias", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1234", usuario: "Juan Perez", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1234", usuario: "María Gonzales", fecha: "20/01/2025", total: 199, estado: "Por entregar" },
  ];

  const [busqueda, setBusqueda] = useState("");

  const filtradas = ordenes.filter((o) =>
    o.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
    o.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="admin-page" style={{ padding: "30px 60px" }}>
      <h2 style={{ marginBottom: "20px" }}>Listado de órdenes</h2>

      {/* Buscador */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar una órden..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            flex: "1",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <button
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Buscar
        </button>
      </div>

      {/* Tabla */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead style={{ backgroundColor: "#f3f3f3" }}>
          <tr>
            <th style={{ padding: "12px", textAlign: "left" }}>#ORDEN</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Usuario</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Fecha de órden</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Total</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Estado</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.length > 0 ? (
            filtradas.map((o, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                <td
                  style={{
                    color: "#28a745",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {o.id}
                </td>
                <td>{o.usuario}</td>
                <td>{o.fecha}</td>
                <td>S/ {o.total}.00</td>
                <td
                  style={{
                    color:
                      o.estado === "Entregado"
                        ? "green"
                        : o.estado === "Por entregar"
                        ? "red"
                        : "black",
                    fontWeight: "bold",
                  }}
                >
                  {o.estado}
                </td>
                <td>
                  <button
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "15px",
                  color: "#777",
                }}
              >
                No se encontraron órdenes.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div
        style={{
          marginTop: "15px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <button style={{ border: "none", background: "none" }}>{"<"}</button>
        <button
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            cursor: "pointer",
          }}
        >
          1
        </button>
        <button style={{ border: "none", background: "none" }}>2</button>
        <button style={{ border: "none", background: "none" }}>3</button>
        <span>...</span>
        <button style={{ border: "none", background: "none" }}>10</button>
        <button style={{ border: "none", background: "none" }}>{">"}</button>
      </div>
    </main>
  );
}

export default ListaOrdenes;
