const productos = [
  // ======== VIDEOJUEGOS ========
  {
    id: 101,
    nombre: "The Legend of Zelda: Tears of the Kingdom",
    categoria: "Videojuegos",
    precio: 229.99,
  imagen: "/zelda.jpg",
    stock: 0,
    descripcion: "Explora un vasto mundo lleno de aventuras y misterios en el nuevo capítulo de Zelda."
  },
  {
    id: 102,
    nombre: "Super Mario Bros Wonder",
    categoria: "Videojuegos",
    precio: 209.99,
  imagen: "/mario-wonder.jpg",
    stock: 0,
    descripcion: "Vuelve Mario con nuevas transformaciones y niveles llenos de diversión para toda la familia."
  },
  {
    id: 103,
    nombre: "Elden Ring",
    categoria: "Videojuegos",
    precio: 265.99,
  imagen: "/elden-ring.jpg",
    stock: 0,
    descripcion: "El galardonado RPG de acción con un extenso mundo abierto y combates desafiantes."
  },

  // ======== CONSOLAS ========
  {
    id: 201,
    nombre: "Nintendo Switch OLED",
    categoria: "Consolas",
    precio: 1329.99,
  imagen: "/switch-oled.jpg",
    stock: 0,
    descripcion: "Versión OLED con pantalla más vibrante y base mejorada para disfrutar tus juegos favoritos."
  },
  {
    id: 202,
    nombre: "PlayStation 5",
    categoria: "Consolas",
    precio: 2279.99,
  imagen: "/ps5.jpg",
    stock: 0,
    descripcion: "Consola de nueva generación con gráficos ultra realistas y velocidad de carga increíble."
  },
  {
    id: 203,
    nombre: "Xbox Series X",
    categoria: "Consolas",
    precio: 2203.99,
  imagen: "/xbox-series-x.jpg",
    stock: 0,
    descripcion: "La consola más potente de Xbox, con soporte 4K y rendimiento de próxima generación."
  },

  // ======== PERIFÉRICOS ========
  {
    id: 301,
    nombre: "Mando Xbox Series",
    categoria: "Periféricos",
    precio: 949.99,
  imagen: "/xbox-controller.jpg",
    stock: 0,
    descripcion: "Control ergonómico con conexión inalámbrica y vibración háptica avanzada."
  },
  {
    id: 302,
    nombre: "Teclado Mecánico RGB",
    categoria: "Periféricos",
    precio: 493.99,
  imagen: "/teclado-rgb.jpg",
    stock: 0,
    descripcion: "Teclado mecánico retroiluminado con switches de alta precisión para gaming."
  },
  {
    id: 303,
    nombre: "Mouse Gamer Logitech G502",
    categoria: "Periféricos",
    precio: 341.99,
  imagen: "/mouse-g502.jpg",
    stock: 0,
    descripcion: "Mouse de precisión con sensor HERO y hasta 11 botones programables."
  },

  // ======== COLECCIONABLES ========
  {
    id: 401,
    nombre: "Figura Link Edición Especial",
    categoria: "Coleccionables",
    precio: 151.99,
  imagen: "/link-figure.jpg",
    stock: 0,
    descripcion: "Figura detallada de Link con base de exhibición, ideal para fans de Zelda."
  },
  {
    id: 402,
    nombre: "Funko Pop Spider-Man",
    categoria: "Coleccionables",
    precio: 75.99,
  imagen: "/funko-spiderman.jpg",
    stock: 0,
    descripcion: "Figura coleccionable estilo Funko Pop del icónico héroe de Marvel."
  },
  {
    id: 403,
    nombre: "Figura Pikachu de Resina",
    categoria: "Coleccionables",
    precio: 113.99,
  imagen: "/pikachu-figure.jpg",
    stock: 0,
    descripcion: "Figura hecha a mano de Pikachu, con pintura detallada y acabado brillante."
  },

  // ======== MEMBRESÍAS ========
  {
    id: 501,
    nombre: "Nintendo Switch Online 12 meses",
    categoria: "Membresías",
    precio: 151.99,
  imagen: "/nintendo-online.jpg",
    stock: 0,
    descripcion: "Accede al juego en línea y catálogo retro de Nintendo durante un año completo."
  },
  {
    id: 502,
    nombre: "PlayStation Plus Premium 12 meses",
    categoria: "Membresías",
    precio: 303.99,
  imagen: "/ps-plus.jpg",
    stock: 0,
    descripcion: "Disfruta de juegos mensuales, acceso anticipado y modo multijugador online."
  },
  {
    id: 503,
    nombre: "Xbox Game Pass Ultimate",
    categoria: "Membresías",
    precio: 227.99,
  imagen: "/game-pass.jpg",
    stock: 0,
    descripcion: "Más de 100 juegos para consola y PC con acceso a estrenos desde el día uno."
  },

  // ======== MERCH ========
  {
    id: 601,
    nombre: "Polera Zelda Trifuerza",
    categoria: "Merch",
    precio: 133.99,
  imagen: "/polera-zelda.jpg",
    stock: 0,
    descripcion: "Polera de algodón premium con diseño de la Trifuerza dorada de Zelda."
  },
  {
    id: 602,
    nombre: "Gorra Super Mario",
    categoria: "Merch",
    precio: 94.99,
  imagen: "/gorra-mario.jpg",
    stock: 0,
    descripcion: "Gorra roja con la clásica ‘M’ bordada, ideal para cualquier fan de Mario."
  },
  {
    id: 603,
    nombre: "Mochila Pokémon Pikachu",
    categoria: "Merch",
    precio: 189.99,
  imagen: "/mochila-pokemon.jpg",
    stock: 0,
    descripcion: "Mochila espaciosa con estampado de Pikachu, perfecta para uso diario o escolar."
  },

  // ======== COMPONENTES PC ========
  {
    id: 701,
    nombre: "Tarjeta Gráfica RTX 4070",
    categoria: "Componentes PC",
    precio: 3039.99,
  imagen: "/rtx4070.jpg",
    stock: 0,
    descripcion: "GPU de última generación con trazado de rayos y rendimiento superior en 1440p."
  },
  {
    id: 702,
    nombre: "Procesador Intel Core i7 13700K",
    categoria: "Componentes PC",
    precio: 1633.99,
  imagen: "/intel-i7.jpg",
    stock: 0,
    descripcion: "Procesador de alto rendimiento ideal para gaming y multitareas intensivas."
  },
  {
    id: 703,
    nombre: "SSD NVMe 2TB Samsung 980 Pro",
    categoria: "Componentes PC",
    precio: 873.99,
  imagen: "/ssd-980pro.jpg",
    stock: 0,
    descripcion: "Unidad de estado sólido ultrarrápida para mejorar tiempos de carga y rendimiento."
  },

  // ======== JUGUETES ========
  {
    id: 801,
    nombre: "LEGO Super Mario Starter Pack",
    categoria: "Juguetes",
    precio: 265.99,
  imagen: "/lego-mario.jpg",
    stock: 0,
    descripcion: "Set interactivo de LEGO con figuras de Mario y niveles personalizables."
  },
  {
    id: 802,
    nombre: "Figura articulada Sonic",
    categoria: "Juguetes",
    precio: 94.99,
  imagen: "/sonic-figure.jpg",
    stock: 0,
    descripcion: "Figura articulada de Sonic con detalles fieles al personaje original."
  },
  {
    id: 803,
    nombre: "Pelota Pokéball oficial",
    categoria: "Juguetes",
    precio: 56.99,
  imagen: "/pokeball.jpg",
    stock: 0,
    descripcion: "Pelota coleccionable de alta calidad inspirada en la clásica Pokéball."
  }
];

export default productos;
