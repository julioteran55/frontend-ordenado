import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../components/context/UserContext";
import "./UsuarioDetalle.css";

function UsuarioDetalle() {
  const { id } = useParams();
  const { usuarios } = useUser();
  const [paginaActual, setPaginaActual] = useState(1);

  const usuario = usuarios.find((u) => String(u.DNI) === String(id));

  if (!usuario) {
    return (
      <main className="usuario-no-encontrado">
        <h2>Usuario no encontrado</h2>
        <Link to="/admin/usuarios" className="volver-link">
          Volver al listado
        </Link>
      </main>
    );
  }

  const ordenes = [
    { id: 1234, fecha: "20/01/2025", total: "S/199.00" },
    { id: 2356, fecha: "20/02/2025", total: "S/199.00" },
    { id: 4577, fecha: "20/03/2025", total: "S/198.00" },
    { id: 3743, fecha: "20/03/2025", total: "S/199.00" },
    { id: 3744, fecha: "20/03/2025", total: "S/199.00" },
    { id: 3745, fecha: "20/03/2025", total: "S/199.00" },
    { id: 3746, fecha: "21/03/2025", total: "S/159.00" },
    { id: 3747, fecha: "21/03/2025", total: "S/189.00" },
  ];

  const ordenesPorPagina = 5;
  const totalPaginas = Math.ceil(ordenes.length / ordenesPorPagina);
  const indiceInicial = (paginaActual - 1) * ordenesPorPagina;
  const ordenesPaginadas = ordenes.slice(
    indiceInicial,
    indiceInicial + ordenesPorPagina
  );

  const cambiarPagina = (nueva) => {
    if (nueva >= 1 && nueva <= totalPaginas) {
      setPaginaActual(nueva);
    }
  };

  return (
    <main className="usuario-detalle-container">
      <h2 className="usuario-titulo">Detalles de usuario</h2>

      <div className="usuario-detalle-box">
        <div className="usuario-detalle-info">
          <div>
            <h2>
              {usuario.nombre} {usuario.apellido}
            </h2>
            <p>
              <strong>Correo:</strong>{" "}
              <a href={`mailto:${usuario.correo}`}>{usuario.correo}</a>
            </p>
            <p>
              <strong>DNI:</strong> {usuario.DNI}
            </p>
            <p>
              <strong>Rol:</strong> {usuario.role}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <span
                className={
                  usuario.active
                    ? "usuario-estado-activo"
                    : "usuario-estado-inactivo"
                }
              >
                {usuario.active ? "Activo" : "Inactivo"}
              </span>
            </p>
          </div>

          <div className="usuario-detalle-foto">
            <img
              src={usuario.foto || "/unknown.jpg"}
              alt={usuario.nombre}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <button className="usuario-btn-verde">🖊 Cambiar contraseña</button>
          </div>
        </div>

        <div className="usuario-detalle-ordenes">
          <h3>Últimas órdenes</h3>
          <table>
            <thead>
              <tr>
                <th>#ID</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenesPaginadas.map((o) => (
                <tr key={o.id}>
                  <td className="usuario-id-orden">#{o.id}</td>
                  <td>{o.fecha}</td>
                  <td>{o.total}</td>
                  <td>
                    <Link
                      to={`/admin/usuarios/${id}/orden/${o.id}`}
                      className="usuario-btn-ver"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="usuario-paginador">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              {"<"}
            </button>

            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => cambiarPagina(i + 1)}
                className={paginaActual === i + 1 ? "activo" : ""}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default UsuarioDetalle;
