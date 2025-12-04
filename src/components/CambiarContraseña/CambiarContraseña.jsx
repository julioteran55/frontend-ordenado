import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/UserContext";
import "./CambiarContraseña.css"; 

const CambiarContraseña = () => {
  const navigate = useNavigate();

  const [antigua, setAntigua] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetir, setRepetir] = useState("");

  const [showAntigua, setShowAntigua] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showRepetir, setShowRepetir] = useState(false);

  const { changePassword } = useUser();

  const handleCambiar = async () => {
    if (!antigua || !nueva || !repetir) {
      return alert("Por favor completa todos los campos");
    }

    if (nueva.length < 6) {
      return alert("La nueva contraseña debe tener al menos 6 caracteres");
    }

    if (nueva !== repetir) {
      return alert("Las contraseñas nuevas no coinciden");
    }

    const exito = await changePassword(antigua, nueva);

    if (exito) {
      alert("Contraseña cambiada correctamente");
      setAntigua("");
      setNueva("");
      setRepetir("");
      navigate("/login");
    } else {
      alert("Contraseña actual incorrecta o error al cambiar la contraseña");
    }
  };

  return (
    <div className="Cambiar-container">
      <div className="Cambiar-card">
        <h2>Cambiar contraseña</h2>

        <label>Contraseña actual</label>
        <div className="input-wrapper">
          <input
            type={showAntigua ? "text" : "password"}
            placeholder="Ingresa tu contraseña actual"
            value={antigua}
            onChange={(e) => setAntigua(e.target.value)}
          />
          <span
            className="eye-icon"
            onClick={() => setShowAntigua(!showAntigua)}
          >
            {showAntigua ? "Ocultar" : "Mostrar"}
          </span>
        </div>

        <label>Nueva contraseña</label>
        <div className="input-wrapper">
          <input
            type={showNueva ? "text" : "password"}
            placeholder="Contraseña"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
          />
          <span
            className="eye-icon"
            onClick={() => setShowNueva(!showNueva)}
          >
            {showNueva ? "Ocultar" : "Mostrar"}
          </span>
        </div>

        <label>Repetir Contraseña</label>
        <div className="input-wrapper">
          <input
            type={showRepetir ? "text" : "password"}
            placeholder="Contraseña"
            value={repetir}
            onChange={(e) => setRepetir(e.target.value)}
          />
          <span
            className="eye-icon"
            onClick={() => setShowRepetir(!showRepetir)}
          >
            {showRepetir ? "Ocultar" : "Mostrar"}
          </span>
        </div>

        <button onClick={handleCambiar}>Cambiar contraseña</button>
      </div>
    </div>
  );
};

export default CambiarContraseña;
