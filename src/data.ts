/* ------------------------------------------------------------------ *
 *  TAXI SERVICE TALARA — contenido del sitio
 *
 *  Sitio 100% estático: no hay panel de administración ni CMS.
 *  Todo el texto vive acá; las fotos y videos van en /public. Para
 *  actualizar algo, se edita este archivo (o los archivos de media) y
 *  se vuelve a compilar y subir el sitio.
 *
 *  Los textos de SERVICES, TARIFAS, WORK_WITH_US y ABOUT son contenido
 *  real de la empresa (tomado tal cual del sitio original) — no
 *  parafrasear ni inventar cifras nuevas al editarlos.
 * ------------------------------------------------------------------ */

/** WhatsApp / celular: +51 923 064 081. Solo dígitos, con prefijo de país. */
export const WA = "51923064081";

export const CONTACT = {
  phone: "+51 923 064 081",
  phoneHref: "tel:+51923064081",
  email: "reservas@taxiservicetalara.com",
  area: "Talara, Piura — Perú",
  address: "Aeropuerto Internacional Capitán FAP Víctor Montes, Urb. Los Pinos L-07, Talara 20811",
  facebook: "https://facebook.com/TAXISERVICETALARA",
  instagram: "https://instagram.com/taxiservicetalara",
} as const;

/**
 * Ítems de navegación. `section` hace scroll dentro de la home;
 * `page` navega a una ruta propia (ver src/App.tsx y src/hooks.ts).
 */
export const NAV = [
  { id: "top", label: "Inicio", kind: "section" },
  { id: "nosotros", label: "Nosotros", kind: "section" },
  { id: "servicios", label: "Servicios", kind: "section" },
  { id: "destinos", label: "Destinos", kind: "section" },
  { id: "trabaja-con-nosotros", label: "Trabaja con nosotros", kind: "page", path: "/trabaja-con-nosotros" },
  { id: "tarifas", label: "Tarifas y Reservas", kind: "page", path: "/tarifas" },
] as const;

export type Media = { type: "image" | "video"; src: string };

export type Destination = {
  id: string;
  label: string;
  tagline: string;
  desc: string;
  media: Media[];
};

/**
 * Destinos turísticos a los que se ofrece traslado. Las fotos y videos
 * son del cliente, ordenados en /public/<id>/. Si un destino nuevo no
 * tiene fotos todavía, `media` puede quedar vacío: la tarjeta se ve
 * bien igual, sin galería.
 */
export const DESTINATIONS: Destination[] = [
  {
    id: "cabo-blanco",
    label: "Cabo Blanco",
    tagline: "Caleta de pescadores y olas de referencia mundial",
    desc: "Uno de los puntos de surf más conocidos del Perú, con caleta de pescadores, muelle y mar abierto. Ideal para ir a ver las olas o pasar el día frente al mar.",
    media: [
      { type: "image", src: "/cabo-blanco/cabo-blanco-2.jpeg" },
      { type: "image", src: "/cabo-blanco/cabo-blanco-3.jpeg" },
      { type: "image", src: "/cabo-blanco/cabo-blanco-1.jpeg" },
      { type: "image", src: "/cabo-blanco/cabo-blanco-4.jpeg" },
      { type: "video", src: "/cabo-blanco/cabo-blanco-video-1.mp4" },
      { type: "video", src: "/cabo-blanco/cabo-blanco-video-2.mp4" },
      { type: "video", src: "/cabo-blanco/cabo-blanco-video-3.mp4" },
    ],
  },
  {
    id: "punta-sal",
    label: "Punta Sal",
    tagline: "Playa extensa y tranquila",
    desc: "Orilla larga y aguas tranquilas, cómoda para pasar el día en familia o simplemente caminar por la playa.",
    media: [
      { type: "image", src: "/punta-sal/punta-sal-1.jpeg" },
      { type: "image", src: "/punta-sal/punta-sal-2.jpeg" },
      { type: "image", src: "/punta-sal/punta-sal-3.jpeg" },
      { type: "image", src: "/punta-sal/punta-sal-4.jpeg" },
    ],
  },
  {
    id: "punta-veleros",
    label: "Punta Veleros",
    tagline: "Bahía resguardada y atardeceres frente al mar",
    desc: "Bahía tranquila con vista al pueblo y a los cerros, conocida por sus atardeceres y por ser un buen punto para el surf.",
    media: [
      { type: "image", src: "/punta-veleros/punta-veleros-2.jpeg" },
      { type: "image", src: "/punta-veleros/punta-veleros-1.jpeg" },
      { type: "image", src: "/punta-veleros/punta-veleros-3.jpeg" },
      { type: "image", src: "/punta-veleros/punta-veleros-4.jpeg" },
      { type: "image", src: "/punta-veleros/punta-veleros-5.jpeg" },
    ],
  },
];

export type Service = {
  id: string;
  label: string;
  desc: string;
  media: Media[];
};

/**
 * Servicios de la empresa — texto real, tomado del sitio original.
 * `media` vacío es válido: la tarjeta muestra un ícono en vez de foto.
 */
export const SERVICES: Service[] = [
  {
    id: "taxi-traslado-aeropuerto",
    label: "Taxi traslado al aeropuerto",
    desc: "Servicios de Taxi Privado a los diferentes aeropuertos: Piura, Talara y Tumbes y recojo desde ellos. Contamos con autos del año full equipo y Vans para 11 y 15 personas (asientos reclinables, aire acondicionado) que les permitirá viajar cómodamente; además cuenta con espacio suficiente para los equipajes.",
    media: [
      { type: "image", src: "/servicio-van-turistica/van-turistica-1.jpeg" },
      { type: "image", src: "/servicio-van-turistica/van-turistica-2.jpeg" },
      { type: "image", src: "/alquiler-camionetas/camioneta-1.jpeg" },
      { type: "image", src: "/alquiler-camionetas/camioneta-2.jpeg" },
    ],
  },
  {
    id: "servicio-turistico",
    label: "Servicio turístico",
    desc: "Brindamos servicio a las diferentes playas del norte: Lobitos, Cabo Blanco, el Ñuro, Punta Veleros, Vichayito, Las Pocitas, Mancora, Punta Sal, Zorritos y Tumbes.",
    media: [{ type: "image", src: "/servicio-turistico-de-bus/bus-turistico-1.png" }],
  },
  {
    id: "taxi-corporativo",
    label: "Taxi corporativo",
    desc: "Servicio corporativo para empresas con tarifas especiales.",
    media: [],
  },
  {
    id: "traslado-eventos",
    label: "Traslado a eventos",
    desc: "Servicio de traslado a eventos, conferencias, congresos, convenciones, seminarios, matrimonios y excursiones.",
    media: [],
  },
];

/** Lo que distingue al servicio — sin cifras que no podemos respaldar. */
export const HIGHLIGHTS = [
  "Reserva y coordinación directa por WhatsApp",
  "Traslados a las playas de la zona",
  "Flota para grupos grandes y pequeños",
] as const;

/** Nosotros — texto real de la empresa (quiénes somos, visión, misión). */
export const ABOUT = {
  quienesSomos:
    "Somos una empresa dinámica, que tiene como objetivo principal satisfacer las necesidades de nuestros clientes, y por eso nuestra experiencia en el sector de taxi consolida un equipo de conductores profesionales que pueden facilitar el desplazamiento de la forma más rápida, cómoda y segura.",
  vision:
    "Ser una empresa líder en el Servicio de taxi y transporte turístico, altamente calificada, gestionada con criterios de excelencia y modernidad, con la mejor calidad humana y operativa.",
  mision:
    "Brindar a nuestros clientes, el mejor servicio con una moderna flota y logística que nos permite una mejor distribución y atención oportuna a nuestros servicios.",
} as const;

/** Trabaja con nosotros — requisitos reales, tal cual el sitio original. */
export const WORK_WITH_US = {
  note: "Cuota de Ingreso (incluye entrega de camisa, fotocheck). Envía tu CV al Correo: reservas@taxiservicetalara.com, o escribe al Whatsapp 923064081.",
  propietario: [
    "D.N.I.",
    "Tarjeta de Propiedad",
    "SOAT de Servicio Publico",
    "Seguro Vehicular Contra Todo Riesgo Modalidad Taxi",
    "Recibo de servicios (Luz o Agua)",
    "Vehículo sin adornos ni publicidad",
  ],
  conductor: [
    "Curriculum Vitae",
    "Copia D.N.I.",
    "Brevete AIIB",
    "Curso de Capacitación Transportes de Pasajeros y Mercancias",
    "Celular RPM",
    "Recibo de servicios (Luz o Agua)",
    "Récord de conductor (Ministerio de T. Terrestre)",
    "Certificado de Antecedentes Policiales Para Trabajo",
  ],
} as const;

export type FareRow = { name: string; auto: string; van: string };
export type FareGroup = { title: string; rows: FareRow[] };

/** Tarifas por aeropuerto de salida — precios reales del sitio original. */
export const TARIFAS: FareGroup[] = [
  {
    title: "Desde el aeropuerto de Talara",
    rows: [
      { name: "Lobitos", auto: "S/ 70", van: "S/ 150" },
      { name: "El Alto (Cabo Blanco)", auto: "S/ 120", van: "S/ 220" },
      { name: "El Ñuro Organos", auto: "S/ 140", van: "S/ 240" },
      { name: "Los Organos (Vichayito)", auto: "S/ 140", van: "S/ 250" },
      { name: "Mancora", auto: "S/ 170", van: "S/ 270" },
      { name: "Punta Sal", auto: "S/ 200", van: "S/ 350" },
      { name: "Zorritos", auto: "S/ 300", van: "S/ 450" },
      { name: "Tumbes", auto: "S/ 400", van: "S/ 550" },
      { name: "Aguas Verdes-Cebaf", auto: "S/ 450", van: "S/ 600" },
    ],
  },
  {
    title: "Desde el aeropuerto de Piura",
    rows: [
      { name: "Talara", auto: "S/ 250", van: "S/ 420" },
      { name: "Lobitos", auto: "S/ 280", van: "S/ 450" },
      { name: "El Alto", auto: "S/ 280", van: "S/ 450" },
      { name: "Los Organos", auto: "S/ 300", van: "S/ 500" },
      { name: "Mancora", auto: "S/ 300", van: "S/ 500" },
      { name: "Punta Sal", auto: "S/ 350", van: "S/ 600" },
      { name: "Zorritos", auto: "S/ 450", van: "S/ 650" },
      { name: "Tumbes", auto: "S/ 550", van: "S/ 750" },
    ],
  },
  {
    title: "Desde el aeropuerto de Tumbes",
    rows: [
      { name: "Zorritos", auto: "S/ 90", van: "S/ 150" },
      { name: "Canoas de Punta Sal", auto: "S/ 160", van: "S/ 280" },
      { name: "Hotel Royal de Cameron", auto: "S/ 180", van: "S/ 300" },
      { name: "Mancora", auto: "S/ 230", van: "S/ 350" },
      { name: "Los Organos", auto: "S/ 270", van: "S/ 400" },
      { name: "El Alto", auto: "S/ 300", van: "S/ 420" },
      { name: "Talara", auto: "S/ 400", van: "S/ 550" },
      { name: "Piura", auto: "S/ 550", van: "S/ 750" },
    ],
  },
];

/** Reservas — condiciones reales del sitio original. */
export const RESERVAS = {
  note: "Para realizar una reserva, debe solicitarlo con 24 horas de anticipación, los medios son por whatsapp, llamada telefónica o email.",
  pago: "Los medios de pago son: Yape, Plim, Transferencia Bancaria, Efectivo y Pago con Tarjeta Visa (mas el 5%)",
} as const;
