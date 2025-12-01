import React from "react";
import "./Footer.css"; 

function Footer() {
  return (
    <footer className="pie-de-pagina">
      <div className="contenedor-columnas">
        <div className="columna">
          <h3>Síguenos</h3>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">YouTube</a></li>
          </ul>
        </div>

        <div className="columna">
          <h3>Nosotros</h3>
          <ul>
            <li><a href="#">Conócenos</a></li>
            <li><a href="#">Responsabilidad social</a></li>
            <li><a href="#">Nuestras tiendas</a></li>
          </ul>
        </div>

        <div className="columna">
          <h3>Atención al cliente</h3>
          <ul>
            <li><a href="#">Atención al cliente </a></li>
            <li><a href="#">Horarios de Atención</a></li>
            <li><a href="#">Preguntas frecuentes</a></li>
          </ul>
        </div>

        <div className="columna">
          <h3>Políticas y condiciones</h3>
          <ul>
            <li><a href="#">Políticas de datos personales</a></li>
            <li><a href="#">Condición de promociones</a></li>
            <li><a href="#"></a>Términos y condiciones</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
