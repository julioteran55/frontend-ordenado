import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/UserContext";
import "./Register.css";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
   const [ciudad, setCiudad] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const navigate = useNavigate();
  const { register } = useUser();

  const handleRegister = () => {
    if (contraseña !== confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }
    const nuevousuario = {
        nombre : nombre,
        apellido: apellido,
        correo: correo,
        password : contraseña,
        tipoUsuario : "usuario",
        estado : "activo",
        direccion: direccion,
        ciudad: ciudad,
    }

    const exito = register(nuevousuario);
    console.log(exito);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registro</h2>

        <div className="register-grid">
          <div>
            <label>Nombre</label>
            <input
              placeholder="Nombre del usuario"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label>Apellido</label>
            <input
              placeholder="Apellido del usuario"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>

          <div>
            <label>Correo</label>
            <input
              type="email"
              placeholder="usuario@gmail.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div>
            <label>Direccion</label>
            <input
              placeholder="Direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>
          
          <div>
            <label>Ciudad</label>
            <input
              placeholder="Ciudad"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
            />
          </div>


          <div>
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
          </div>

          <div>
            <label>Confirmar contraseña</label>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleRegister}>Registrarme</button>
      </div>
    </div>
  );
};

export default Register;
