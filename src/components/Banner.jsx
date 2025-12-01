import { useEffect, useState } from "react";
import "./Banner.css";

function Banner() {
  const imagenes = ["GTA1.jpg", "IJ1.jpg", "MC1.jpg"];
  const [actual, setActual] = useState(0);

  useEffect(() => {
    const cambio = setInterval(() => {
      setActual((prev) => (prev + 1) % imagenes.length);
    }, 4000);

    return () => clearInterval(cambio);
  }, []);

  return (
    <div className="banner">
      {imagenes.map((img, index) => (
        <div
          key={index}
          className={index === actual ? "slide activa" : "slide"}
          style={{ backgroundImage: `url(/${img})` }}
        ></div>
      ))}

      <div className="puntos">
        {imagenes.map((_, index) => (
          <span
            key={index}
            className={index === actual ? "punto activo" : "punto"}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Banner;
