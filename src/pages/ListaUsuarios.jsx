import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/context/UserContext";
import "./ListaUsuarios.css";


function ListaUsuarios() {
  const navigate = useNavigate();
  const { usuarios } = useUser();
  const [busqueda, setBusqueda] = useState("");

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleVerDetalle = (dni) => {
    navigate(`/admin/usuarios/${dni}`);
  };

  return (
    <main className="admin-page">
      <h2>Listado de usuarios</h2>

      <input
        type="text"
        placeholder="Buscar un usuario..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="buscador"
      />

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Nombre completo</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuariosFiltrados.length > 0 ? (
            usuariosFiltrados.map((u) => (
              <tr key={u.DNI}>
                <td className="nombre-usuario">
                  <img
                    src={u.foto ? u.foto : "/unknown.jpg"}
                    alt={u.nombre}
                    className="foto-usuario"
                  />
                  {u.nombre} {u.apellido}
                </td>
                <td>{u.correo}</td>
                <td>{u.role}</td>
                <td className={u.active ? "estado-activo" : "estado-inactivo"}>
                  {u.active ? "Activo" : "Inactivo"}
                </td>
                <td>
                  <button className="btn-sec">Desactivar</button>
                  <button
                    className="btn-ver"
                    onClick={() => handleVerDetalle(u.DNI)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="sin-usuarios">
                No se encontraron usuarios.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}

export default ListaUsuarios;
