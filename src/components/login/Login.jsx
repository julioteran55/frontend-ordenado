import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/UserContext";
import "./Login.css";
import { login as loginApi } from "../../api/auth"; // login del backend
const Login = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");

  const handleLogin = async () => {
    try {
      // Enviamos EXACTAMENTE lo mismo que en Postman
      const data = await loginApi({
        correo,
        password: contraseña,
      });
      console.log(data)
      localStorage.setItem("usuario", JSON.stringify(data.user));
      console.log("Respuesta login:", data);

      // Si llegamos aquí, el backend ya dijo "Login exitoso"
      navigate("/register/MisOrdenes");
      window.location.reload()
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // Aquí solo entramos si la respuesta NO es 2xx
      alert(error.message || "Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar sesión</h2>

        <label>Correo</label>
        <input
          type="email"
          placeholder="usuario@gmail.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <label>Contraseña</label>
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />

        <button onClick={handleLogin}>Iniciar sesión</button>

        <p>
          <span
            className="registro-link"
            onClick={() => navigate("/register")}
          >
            Registrarme
          </span>
        </p>
        <p className="olvide-link">Olvidé mi contraseña</p>
      </div>
    </div>
  );
};

export default Login;

