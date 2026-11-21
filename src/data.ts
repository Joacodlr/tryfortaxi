/* ==================================================================
   CONTENIDO DEL SITIO — todo lo editable está acá.
   Los datos marcados con  PENDIENTE  hay que confirmarlos con el cliente.
   ================================================================== */

/** Ruta a una imagen de public/img, respetando la base del build
 *  ("/" en hosting normal, la carpeta del tema en WordPress). */
export const img = (file: string) => `${import.meta.env.BASE_URL}img/${file}`;

/** Dónde se envía el Libro de Reclamaciones (PHP propio o REST de WordPress). */
export const RECLAMO_URL: string = import.meta.env.VITE_RECLAMO_URL || "/api/reclamo.php";

export const COMPANY = {
  name: "Transportes Tomy D.",
  legalName: "Transportes Tomy D. E.I.R.L.",
  tagline: "Servicio turístico y de personal",
  // PENDIENTE: RUC
  ruc: "",
  phoneDisplay: "970 729 218",
  phoneIntl: "51970729218",
  email: "transportestomyd@gmail.com",
  // PENDIENTE: confirmar ciudad / zona de cobertura y dirección
  city: "Lima, Perú",
  address: "",
  hours: "Atención 24 horas, los 7 días",
  // PENDIENTE: enlaces reales a redes (dejar "" para ocultar el ícono)
  facebook: "",
  instagram: "",
  tiktok: "",
};

export const telHref = `tel:+${COMPANY.phoneIntl}`;
export const mailHref = `mailto:${COMPANY.email}`;

/** Enlace de WhatsApp con un mensaje ya escrito. */
export const waLink = (msg = "Hola Transportes Tomy D., quisiera información sobre sus servicios.") =>
  `https://wa.me/${COMPANY.phoneIntl}?text=${encodeURIComponent(msg)}`;

export const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/servicios", label: "Servicios" },
  { to: "/flota", label: "Flota" },
  { to: "/contacto", label: "Contacto" },
] as const;

/* --------------------------------------------------------------- */

export type Service = {
  id: string;
  icon: "users" | "map" | "plane" | "car" | "calendar";
  title: string;
  short: string;
  long: string;
  points: string[];
  image: string;
};

// PENDIENTE: confirmar con el cliente la lista exacta de servicios.
export const SERVICES: Service[] = [
  {
    id: "personal",
    icon: "users",
    title: "Transporte de personal",
    short: "Rutas diarias para tu empresa: puntuales, seguras y a la medida de tus turnos.",
    long: "Llevamos a tus colaboradores de su casa al trabajo y de regreso, todos los días. Diseñamos contigo las rutas y horarios según tus turnos, para que tu equipo llegue a tiempo y descansado.",
    points: ["Rutas y horarios a la medida", "Turnos de día, noche y madrugada", "Conductores fijos y con experiencia", "Facturación mensual para empresas"],
    image: img("sentra-plata.jpg"),
  },
  {
    id: "turismo",
    icon: "map",
    title: "Servicio turístico",
    short: "Tours, excursiones y paseos con conductores que conocen cada destino.",
    long: "Recorre la ciudad y sus alrededores con comodidad. Atendemos a turistas nacionales y extranjeros, a familias y a grupos, con itinerarios flexibles y conductores que conocen cada destino.",
    points: ["City tours y excursiones", "Grupos y familias", "Itinerarios flexibles", "Atención a turistas extranjeros"],
    image: img("xtrail-rojo.jpg"),
  },
  {
    id: "aeropuerto",
    icon: "plane",
    title: "Traslados al aeropuerto",
    short: "Te recogemos y te dejamos a tiempo, a cualquier hora del día o de la noche.",
    long: "Recojo y traslado al aeropuerto, a hoteles y a terminales terrestres. Seguimos tu vuelo para estar ahí aunque se adelante o se retrase.",
    points: ["Recojo con cartel de bienvenida", "Seguimiento del vuelo", "Espacio para equipaje", "Servicio las 24 horas"],
    image: img("elantra-plata.jpg"),
  },
  {
    id: "privado",
    icon: "car",
    title: "Viajes privados y eventos",
    short: "Movilidad exclusiva para reuniones, eventos, bodas o viajes interprovinciales.",
    long: "Un vehículo con conductor solo para ti o tu grupo: reuniones de negocios, eventos corporativos, matrimonios, paseos o viajes a provincia.",
    points: ["Vehículo exclusivo con conductor", "Por horas, día completo o viaje", "Eventos corporativos y sociales", "Viajes a provincia"],
    image: img("accent-negro.jpg"),
  },
];

/* --------------------------------------------------------------- */

export type Vehicle = {
  name: string;
  type: string;
  seats: number;
  luggage: string;
  image?: string;
  features: string[];
};

// PENDIENTE: confirmar la flota real y conseguir foto de la van del logo.
export const FLEET: Vehicle[] = [
  {
    name: "Van ejecutiva",
    type: "Van",
    seats: 10,
    luggage: "Equipaje grande",
    features: ["Aire acondicionado", "Ideal para grupos y personal", "Asientos reclinables"],
  },
  {
    name: "Nissan X-Trail",
    type: "SUV",
    seats: 4,
    luggage: "3 maletas",
    image: img("xtrail-rojo.jpg"),
    features: ["Aire acondicionado", "Amplio y cómodo", "Ideal para turismo"],
  },
  {
    name: "Hyundai Santa Fe",
    type: "SUV",
    seats: 4,
    luggage: "3 maletas",
    image: img("santafe-plata.jpg"),
    features: ["Aire acondicionado", "Amplio y cómodo", "Ideal para viajes largos"],
  },
  {
    name: "Kia Sportage",
    type: "SUV",
    seats: 4,
    luggage: "2 maletas",
    image: img("sportage-blanco.jpg"),
    features: ["Aire acondicionado", "Cómodo en ciudad y carretera"],
  },
  {
    name: "Nissan Sentra",
    type: "Sedán",
    seats: 4,
    luggage: "2 maletas",
    image: img("sentra-plata.jpg"),
    features: ["Aire acondicionado", "Ejecutivo", "Ideal para aeropuerto"],
  },
  {
    name: "Hyundai Elantra",
    type: "Sedán",
    seats: 4,
    luggage: "2 maletas",
    image: img("elantra-azul.jpg"),
    features: ["Aire acondicionado", "Ejecutivo", "Ideal para aeropuerto"],
  },
  {
    name: "Hyundai Accent",
    type: "Sedán",
    seats: 4,
    luggage: "2 maletas",
    image: img("accent-negro.jpg"),
    features: ["Aire acondicionado", "Económico", "Ideal para la ciudad"],
  },
];

export const HERO_SLIDES = [img("sentra-plata.jpg"), img("xtrail-rojo.jpg"), img("santafe-plata.jpg"), img("elantra-azul.jpg")];

export const REASONS = [
  { icon: "clock", title: "Puntualidad", text: "Salimos y llegamos a la hora acordada. Tu equipo y tus pasajeros no esperan." },
  { icon: "shield", title: "Seguridad", text: "Unidades con mantenimiento al día, SOAT vigente y conductores con experiencia." },
  { icon: "armchair", title: "Comodidad", text: "Vehículos limpios, con aire acondicionado y espacio para viajar a gusto." },
  { icon: "route", title: "Rutas a tu medida", text: "Diseñamos contigo los recorridos y horarios que mejor le sirven a tu gente." },
] as const;

export const STEPS = [
  { title: "Escríbenos", text: "Cuéntanos qué servicio necesitas, la fecha y cuántos pasajeros son." },
  { title: "Recibe tu cotización", text: "Te respondemos rápido por WhatsApp con el precio y la unidad ideal." },
  { title: "Viaja tranquilo", text: "Confirmas y nosotros nos encargamos del resto, puntuales y seguros." },
];
