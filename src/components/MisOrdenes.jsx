import React, { useEffect, useState } from "react";
import "./MisOrdenes.css";
import ModalOrden from "./Modaldetalleorden.jsx";
import fotoPerfil from "../assets/I6.webp";
import { obtenerOrdenesPorUsuario } from "../api/ordenes.js";

function MisOrdenes() {
  const [usuario, setUsuario] = useState(null);
  const [ordenes, setOrdenes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [busquedaOrden, setBusquedaOrden] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar usuario de localStorage y órdenes del backend
  useEffect(() => {
    // 1) Usuario
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      try {
        setUsuario(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error al parsear usuario de localStorage", e);
      }
    }

     if (!storedUser) {
      alert("Debes iniciar sesión para acceder a esta página.");
      window.location.href = "/login";
      return;
    }

    // 2) Órdenes del usuario autenticado
    const fetchOrdenes = async () => {
      try {
        const data = await obtenerOrdenesPorUsuario();
        // Tu endpoint devuelve un array de órdenes
        setOrdenes(data);
      } catch (err) {
        console.error("Error obteniendo órdenes:", err);
        setError(err.message || "No se pudieron cargar tus órdenes.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, []);

  const handleVerDetalles = (orden) => {
    setOrdenSeleccionada(orden);
  };

  const handleBusquedaOrden = (e) => {
    setBusquedaOrden(e.target.value);
  };

  const ordenesFiltradas = ordenes.filter((orden) =>
    orden.id.toString().includes(busquedaOrden)
  );

  const nombreCompleto =
    (usuario?.nombre || "") +
    (usuario?.apellido ? ` ${usuario.apellido}` : "");

  const totalGastado = ordenes.reduce(
    (acc, o) => acc + Number(o.total || 0),
    0
  );

  return (
    <div className="dashboard">
      <h1>Hola {usuario?.nombre ? usuario.nombre : "usuario"}!</h1>

      {/* PANEL SUPERIOR CON DATOS DEL USUARIO */}
      <div className="usuario-contenedor">
        <div className="usuario-info2">
          <h3>
            <strong>Datos Personales</strong>
          </h3>
          <p>
            <strong>Nombre:</strong>{" "}
            {nombreCompleto || "Sin nombre registrado"}
          </p>
          <p>
            <strong>Correo:</strong>{" "}
            {usuario?.correo || usuario?.email || "Sin correo"}
          </p>
          <p>
            <strong>Fecha de registro:</strong>{" "}
            {usuario?.fechaRegistro
              ? new Date(usuario.fechaRegistro).toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div className="usuario-direccion">
          <h3>
            <strong>Dirección de envío</strong>
          </h3>
          <p>{usuario?.direccion || "Sin dirección registrada"}</p>
          <p>{usuario?.ciudad || ""}</p>
          <p>
            <strong>Celular de contacto:</strong>{" "}
            {usuario?.telefono || "-"}
          </p>
        </div>

        <div className="resumen">
          <div className="resumen-box">
            <h3>Órdenes: {ordenes.length}</h3>
          </div>
          <div className="resumen-box">
            <h3>
              Total gastado: ${totalGastado.toFixed(2)}
            </h3>
          </div>
        </div>

        <div className="container-imagen">
          <img src={fotoPerfil} alt="Foto de perfil" />
        </div>
      </div>

      {/* BUSCADOR DE ÓRDENES */}
      <div className="acciones-superiores">
        <input
          type="text"
          placeholder="Buscar por número de orden..."
          value={busquedaOrden}
          onChange={handleBusquedaOrden}
          style={{
            marginBottom: "1rem",
            marginTop: "1rem",
            padding: "8px",
            width: "100%",
          }}
        />
      </div>

      {/* TABLA DE ÓRDENES */}
      <div className="tabla-ordenes">
        <h3>Historial de órdenes</h3>

        {loading ? (
          <p>Cargando órdenes...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : ordenesFiltradas.length === 0 ? (
          <p>No se encontraron órdenes.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#Orden</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado de pago</th>
                <th>Dirección de envío</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradas.map((orden) => (
                <tr key={orden.id}>
                  <td>{orden.id}</td>
                  <td>
                    {orden.fecha
                      ? new Date(orden.fecha).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>${Number(orden.total || 0).toFixed(2)}</td>
                  <td>{orden.estadoPago}</td>
                  <td>{orden.direccionEnvio}</td>
                  <td>
                    <button
                      className="btn-verdetalle"
                      onClick={() => handleVerDetalles(orden)}
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Si luego quieres, aquí puedes meter paginación real con el backend */}

      {/* MODAL CON DETALLE DE LA ORDEN */}
      <ModalOrden
        orden={ordenSeleccionada}
        onClose={() => setOrdenSeleccionada(null)}
      />
    </div>
  );
}

export default MisOrdenes;
