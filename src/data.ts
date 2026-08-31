/* ------------------------------------------------------------------ *
 *  TAXI SERVICE TALARA — contenido del sitio
 *
 *  Sitio 100% estático: no hay panel de administración ni CMS.
 *  Todo el texto vive acá; las fotos y videos van en /public. Para
 *  actualizar algo, se edita este archivo (o los archivos de media) y
 *  se vuelve a compilar y subir el sitio.
 * ------------------------------------------------------------------ */

/** WhatsApp / celular: +51 923 064 081. Solo dígitos, con prefijo de país. */
export const WA = "51923064081";

export const CONTACT = {
  phone: "+51 923 064 081",
  phoneHref: "tel:+51923064081",
  email: "reservas@taxiservicetalara.com",
  area: "Talara, Piura — Perú",
  facebook: "https://facebook.com/TAXISERVICETALARA",
  instagram: "https://instagram.com/taxiservicetalara",
} as const;

export const NAV = [
  { id: "top", label: "Inicio" },
  { id: "destinos", label: "Destinos" },
  { id: "servicios", label: "Servicios" },
  { id: "nosotros", label: "Nosotros" },
  { id: "contacto", label: "Contacto" },
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

export type TransportService = {
  id: string;
  label: string;
  desc: string;
  media: Media[];
};

/**
 * Servicios de transporte. `media` vacío es válido: la tarjeta muestra
 * un ícono en vez de foto hasta que el cliente tenga imágenes propias.
 */
export const TRANSPORT_SERVICES: TransportService[] = [
  {
    id: "servicio-van-turistica",
    label: "Van turística",
    desc: "Traslados al aeropuerto de Talara y a los balnearios cercanos, con espacio para equipaje.",
    media: [
      { type: "image", src: "/servicio-van-turistica/van-turistica-1.jpeg" },
      { type: "image", src: "/servicio-van-turistica/van-turistica-2.jpeg" },
    ],
  },
  {
    id: "alquiler-camionetas",
    label: "Alquiler de camionetas",
    desc: "Camionetas con conductor para grupos, familias o rutas a medida por la zona.",
    media: [
      { type: "image", src: "/alquiler-camionetas/camioneta-1.jpeg" },
      { type: "image", src: "/alquiler-camionetas/camioneta-2.jpeg" },
    ],
  },
  {
    id: "servicio-turistico-de-bus",
    label: "Servicio turístico en bus",
    desc: "Movilidad para grupos grandes: excursiones y traslados programados.",
    media: [{ type: "image", src: "/servicio-turistico-de-bus/bus-turistico-1.png" }],
  },
];

/** Lo que distingue al servicio — sin cifras que no podemos respaldar. */
export const HIGHLIGHTS = [
  "Reserva y coordinación directa por WhatsApp",
  "Traslados a las playas de la zona",
  "Flota para grupos grandes y pequeños",
] as const;
