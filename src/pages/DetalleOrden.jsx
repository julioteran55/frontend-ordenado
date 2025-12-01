import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetalleOrden.css";

function DetalleOrden() {
  const { id } = useParams();
  const navigate = useNavigate();

  const orden = {
    estado: "Entregado",
    total: 400,
    productos: [
      { id: "#0223", nombre: "Mario Kart", categoria: "Videojuegos", cantidad: 10, total: 180, imagen: "/MARIO1.jpg" },
      { id: "#6425", nombre: "GTA V", categoria: "Videojuegos", cantidad: 4, total: 190, imagen: "/GTA1.jpg" },
      { id: "#2344", nombre: "Minecraft", categoria: "Videojuegos", cantidad: 4, total: 190, imagen: "/MC1.jpg" },
      { id: "#8123", nombre: "Desconocido", categoria: "Otros", cantidad: 1, total: 190, imagen: "/unknown.jpg" },
      { id: "#9991", nombre: "Metal Gear Solid", categoria: "Videojuegos", cantidad: 3, total: 180, imagen: "/GTA1.jpg" },
      { id: "#9992", nombre: "Zelda", categoria: "Videojuegos", cantidad: 2, total: 250, imagen: "/MARIO1.jpg" },
      { id: "#9993", nombre: "God of War", categoria: "Videojuegos", cantidad: 1, total: 300, imagen: "/MC1.jpg" },
    ],
  };

  const porPagina = 5;
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.ceil(orden.productos.length / porPagina);

  const productosPaginados = useMemo(() => {
    const inicio = (pagina - 1) * porPagina;
    return orden.productos.slice(inicio, inicio + porPagina);
  }, [pagina, orden.productos]);

  return (
    <main className="detalle-orden-page">
      <h2>Detalle de orden</h2>

      <div className="detalle-box">
        <h3>
          Orden <span className="verde">#{id}</span>
        </h3>
        <p>
          Estado:{" "}
          <span className={orden.estado === "Entregado" ? "verde" : "rojo"}>
            {orden.estado}
          </span>
        </p>
        <p>
          Monto total: <strong>S/ {orden.total.toFixed(2)}</strong>
        </p>

        <h4>Productos ordenados</h4>
        <table className="detalle-tabla">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Id</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {productosPaginados.map((p) => (
              <tr key={p.id}>
                <td>
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="img-producto"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td className="verde">{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{p.cantidad}</td>
                <td>S/ {p.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

     
        <div className="paginador">
          <button
            onClick={() => setPagina((p) => Math.max(p - 1, 1))}
            disabled={pagina === 1}
          >
            &lt;
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPagina(num)}
              className={num === pagina ? "activo" : ""}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
            disabled={pagina === totalPaginas}
          >
            &gt;
          </button>
        </div>

        <button className="btn-volver" onClick={() => navigate(-1)}>
          ⬅ Volver
        </button>
      </div>
    </main>
  );
}

export default DetalleOrden;
