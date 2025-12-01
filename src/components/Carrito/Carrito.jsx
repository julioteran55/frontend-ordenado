import "./Carrito.css";
import { useCart } from "../context/CartContext.jsx";
import Asside from "../asside.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";

const Carrito = () => {
  const {
    carrito,
    eliminarProducto,
    actualizarCantidad,
    vaciarCarrito,
    loading // Opcional: podrías usar esto para mostrar un spinner
  } = useCart();
  
  const navigate = useNavigate();
  const { user } = useUser();

  // ======== OPERACIONES ========
  const AumentarCantidad = (id) => actualizarCantidad(id, 1);
  
  const DisminuirCantidad = (id) => {
    const p = carrito.find((i) => i.id === id);
    if (p && p.cantidad > 1) actualizarCantidad(id, -1);
  };

  const handleCancelar = () => {
    // Preguntar antes de borrar todo es buena práctica
    if(confirm("¿Estás seguro de vaciar el carrito?")) {
        vaciarCarrito();
        navigate("/");
    }
  };

  const handleContinuar = () => {
    if (user) navigate("/checkout");
    else {
      alert("Inicia sesión para continuar la compra");
      navigate("/login");
    }
  };

  // VISTA: CARGANDO
  if (loading && carrito.length === 0) {
      return <div className="cart container"><p>Cargando carrito...</p></div>;
  }

  // VISTA: VACÍO
  if (!carrito || carrito.length === 0) {
    return (
      <section className="cart container">
        <h1 className="cart__title">Carrito (0 productos)</h1>
        <p>Tu carrito está vacío.</p>
        <button className="btn-green" onClick={() => navigate('/')}>
            Ir a comprar
        </button>
      </section>
    );
  }

  // Cálculos visuales
  const totalItems = carrito.reduce((s, it) => s + (it.cantidad ?? 1), 0);
  const totalPrecio = carrito.reduce(
    (s, it) => s + it.precio * (it.cantidad ?? 1),
    0
  );

  return (
    <section className="cart-container">
      <h1 className="cart__title">
        Carrito <span className="muted">({totalItems} productos)</span>
      </h1>

      <div className="cart-grid">
        <div className="cart-list">
          {carrito.map((producto) => {
            const price = Number(producto.precio ?? 0);
            const qty = Number(producto.cantidad ?? 1);

            return (
              <article key={producto.id} className="cart-item">
                <img src={producto.imagen} alt={producto.nombre} className="cart-img" />
                <div className="cart-info">
                  <h3>{producto.nombre}</h3>
                  <p className="cat">{producto.categoria?.nombre || 'Producto'}</p> {/* Ajuste seguro por si categoría es objeto o null */}
                  <p className="eta">Llega mañana</p>

                  <div className="controls">
                    <span>Cantidad</span>
                    <div className="qty">
                      <button onClick={() => DisminuirCantidad(producto.id)} disabled={qty <= 1}>-</button>
                      <span>{qty}</span>
                      <button onClick={() => AumentarCantidad(producto.id)}>+</button>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="cart-price">S/ {(price * qty).toFixed(2)}</div>
              </article>
            );
          })}
        </div>

        <div className="cart-aside">
          <Asside
            totalItems={totalItems}
            totalPrecio={totalPrecio}
            buttonText="Continuar compra"
            onAction={handleContinuar}
          />

          <div className="extra-buttons">
            <button className="btn-red" onClick={handleCancelar}>
              Vaciar Carrito
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carrito;