import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./ListaOrdenes.css";

function ListaOrdenes() {
  const navigate = useNavigate();

  const ordenes = [
    { id: "#1234", usuario: "Juan Perez", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1235", usuario: "María Gonzales", fecha: "20/01/2025", total: 199, estado: "Por entregar" },
    { id: "#1236", usuario: "Marco Aurelio", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1237", usuario: "Ana Dias", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1238", usuario: "Juan Perez", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1239", usuario: "María Gonzales", fecha: "20/01/2025", total: 199, estado: "Por entregar" },
    { id: "#1240", usuario: "Marco Aurelio", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1241", usuario: "Ana Dias", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1242", usuario: "Juan Perez", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1243", usuario: "María Gonzales", fecha: "20/01/2025", total: 199, estado: "Por entregar" },
    { id: "#1244", usuario: "Marco Aurelio", fecha: "20/01/2025", total: 199, estado: "Entregado" },
    { id: "#1245", usuario: "Ana Dias", fecha: "20/01/2025", total: 199, estado: "Entregado" },
  ];

  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  const filtradas = ordenes.filter(
    (o) =>
      o.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      o.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtradas.length / porPagina);

  const paginadas = useMemo(() => {
    const inicio = (pagina - 1) * porPagina;
    return filtradas.slice(inicio, inicio + porPagina);
  }, [pagina, filtradas]);

  const handleDetalle = (id) => {
    const cleanId = id.replace("#", "");
    navigate(`/admin/ordenes/${cleanId}`); 
  };

  return (
    <main className="lista-ordenes">
      <h2>Listado de órdenes</h2>

      <div className="lista-box">
        <div className="busqueda-container">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Buscar una órden..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button type="button">Buscar</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>#ORDEN</th>
              <th>Usuario</th>
              <th>Fecha de órden</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginadas.length > 0 ? (
              paginadas.map((o) => (
                <tr key={o.id}>
                  <td className="verde">{o.id}</td>
                  <td>{o.usuario}</td>
                  <td>{o.fecha}</td>
                  <td>S/ {o.total.toFixed(2)}</td>
                  <td className={o.estado === "Entregado" ? "verde" : "rojo"}>
                    {o.estado}
                  </td>
                  <td>
                    <button
                      className="btn-detalle"
                      onClick={() => handleDetalle(o.id)}
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No se encontraron órdenes.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="paginador">
          <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 1}>
            &lt;
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPagina(num)}
              style={{
                backgroundColor: num === pagina ? "#3ca63c" : "white",
                color: num === pagina ? "white" : "#333",
                borderColor: num === pagina ? "#3ca63c" : "#d1d1d1",
              }}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setPagina(pagina + 1)}
            disabled={pagina === totalPaginas}
          >
            &gt;
          </button>
        </div>
      </div>
    </main>
  );
}

export default ListaOrdenes;
