import React from "react";
import "./Nosotros.css";

const Nosotros = () => {
  return (
    <div className="nosotros-container">
      <section className="nosotros-hero">
        <h1>Sobre Nosotros</h1>
        <p>
          Somos estudiantes de la <strong>Universidad de Lima</strong> que desarrollamos esta plataforma como parte del curso
          <strong> Programación Web</strong>. Nuestro objetivo es aplicar lo aprendido en clase para construir una
          aplicación funcional, moderna y enfocada en la experiencia del usuario.
        </p>
      </section>

      <section className="nosotros-section">
        <h2>Nuestra Misión</h2>
        <p>
          Brindar una solución digital completa que simule una tienda virtual real, integrando conceptos de
          desarrollo frontend, backend, consumo de APIs, manejo de estados, diseño responsivo y buenas
          prácticas de programación.
        </p>
      </section>

      <section className="nosotros-section">
        <h2>¿Qué hace esta plataforma?</h2>
        <ul className="nosotros-lista">
          <li>Permite visualizar productos</li>
          <li>Gestionar un carrito de compras real</li>
          <li>Realizar búsquedas y filtrado</li>
          <li>Conectarse con un backend mediante API REST</li>
          <li>Simular un flujo e-commerce completo</li>
        </ul>
      </section>

      <section className="nosotros-section">
        <h2>El Equipo</h2>
        <p>
          Este proyecto fue desarrollado por estudiantes comprometidos con aprender tecnologías web modernas,
          explorando herramientas actuales como <strong>React</strong>, <strong>Node.js</strong>, <strong>Express</strong> y
          manejo de bases de datos.
        </p>
      </section>

      <section className="nosotros-final">
        <p>© {new Date().getFullYear()} Proyecto de Programación Web — Universidad de Lima</p>
      </section>
    </div>
  );
};

export default Nosotros;
