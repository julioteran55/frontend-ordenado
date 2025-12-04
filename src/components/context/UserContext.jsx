import { createContext, useState, useContext, useEffect } from "react";
import usuariosBase from "../../data/usuarios.js";
import { registerUser, logoutApi } from "../../api/auth.js";
import { changePasswordApi } from "../../api/auth.js";
const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  //  Al montar el contexto, cargamos usuarios del localStorage o del JSON
  useEffect(() => {
    const almacenados = JSON.parse(localStorage.getItem("usuarios"));
    if (almacenados && almacenados.length > 0) {
      setUsuarios(almacenados);
    } else {
      localStorage.setItem("usuarios", JSON.stringify(usuariosBase));
      setUsuarios(usuariosBase);
    }

    // Recuperar sesión si había un usuario logueado
    const sesion = JSON.parse(localStorage.getItem("usuario"));
    if (sesion) setUser(sesion);
  }, []);

  // 🔐 LOGIN

  // 📝 REGISTRO
  const register = async (nuevoUsuario) => {
    try{
    const data = await registerUser(nuevoUsuario)
     alert("Registro exitoso. Ahora puedes iniciar sesión.");
      return data
  }
    catch (error) {
      console.error("Error al registrarse", error);
      // Aquí solo entramos si la respuesta NO es 2xx
      alert(error.message || "Correo o contraseña incorrectos");
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario");
    logoutApi();
    window.location.reload()
  };

 const changePassword = async (actualPassword, nuevaPassword) => {
    try {
      await changePasswordApi({ actualPassword, nuevaPassword });
      return true; // éxito
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      return false; // fallo (contraseña actual incorrecta, etc.)
    }
  }


  const value = { user, logout, register, usuarios , changePassword };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
