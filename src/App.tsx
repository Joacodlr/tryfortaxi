import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bus,
  Car,
  Check,
  Images,
  Mail,
  MapPin,
  Menu,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  Truck,
  Waves,
  X,
} from "lucide-react";

import { ABOUT, CONTACT, DESTINATIONS, HIGHLIGHTS, NAV, SERVICES, SERVICE_NOTES, WA } from "./data";
import type { Destination, Media, Service, ServiceNote } from "./data";
import { Btn, Eyebrow, Reveal } from "./ui";
import { useRevealOnScroll, useRoute } from "./hooks";
import { Lightbox } from "./lib/Lightbox";
import { DestinationPage } from "./DestinationPage";
import { WorkWithUsPage } from "./WorkWithUsPage";
import { TarifasPage } from "./TarifasPage";

/* ------------------------------------------------------------------ *
 *  TAXI SERVICE TALARA — traslados y turismo en Talara
 *
 *  Sitio estático, sin CMS ni panel de administración: el contenido
 *  vive en src/data.ts y las fotos/videos en /public.
 * ------------------------------------------------------------------ */

const waHref = (msg?: string) =>
  `https://wa.me/${WA}?text=` +
  encodeURIComponent(msg ?? "Hola, quisiera coordinar un traslado en Talara.");

type GalleryState = { items: Media[]; index: number };

const DEST_PATH = /^\/destinos\/([a-z0-9-]+)\/?$/;

export default function App() {
  const [menu, setMenu] = useState(false);
  const [gallery, setGallery] = useState<GalleryState | null>(null);
  const { path, navigate } = useRoute();
  useRevealOnScroll();

  useEffect(() => {
    document.body.style.overflow = menu || gallery ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu, gallery]);

  const destMatch = path.match(DEST_PATH);
  const activeDest = destMatch ? DESTINATIONS.find((d) => d.id === destMatch[1]) : undefined;
  const onWorkPage = path === "/trabaja-con-nosotros";
  const onFaresPage = path === "/tarifas";

  /**
   * Navega según el tipo de ítem: una "page" (Trabaja con nosotros,
   * Tarifas) va a su propia ruta; una "section" vuelve a la home (si
   * hace falta) y hace scroll hasta ese id.
   */
  const goto = (id: string) => {
    setMenu(false);
    const item = NAV.find((n) => n.id === id);
    if (item?.kind === "page") {
      navigate(item.path);
      return;
    }
    if (path !== "/") {
      navigate("/");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })),
      );
    } else {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }));
    }
  };

  const goDestination = (id: string) => {
    setMenu(false);
    navigate(`/destinos/${id}`);
  };

  const openGallery = (items: Media[], index = 0) => setGallery({ items, index });

  return (
    <div className="font-body text-ink">
      <a
        href="#destinos"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-display focus:font-semibold focus:text-carbon"
      >
        Saltar a destinos
      </a>

      <Header menu={menu} setMenu={setMenu} goto={goto} />

      <main id="top">
        {activeDest ? (
          <DestinationPage
            dest={activeDest}
            onBack={() => goto("destinos")}
            onOpenLightbox={openGallery}
            onNavigate={goDestination}
          />
        ) : onWorkPage ? (
          <WorkWithUsPage />
        ) : onFaresPage ? (
          <TarifasPage />
        ) : (
          <>
            <Hero goto={goto} />
            <Highlights />
            <Destinations onOpen={goDestination} />
            <Services onOpen={openGallery} onGoFares={() => navigate("/tarifas")} />
            <About />
            <Contact />
          </>
        )}
      </main>

      <Footer goto={goto} />

      <a
        href={waHref()}
        target="_blank"
        rel="noreferrer"
        aria-label="Escribir por WhatsApp"
        className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-wa text-white shadow-[0_12px_30px_-6px_rgba(37,211,102,.7)] transition-transform duration-300 hover:scale-110 sm:bottom-7 sm:right-7"
      >
        <span className="anim-pulse-ring absolute inset-0 rounded-full bg-wa" aria-hidden="true" />
        <span className="relative z-10">
          <WhatsAppIcon size={27} />
        </span>
      </a>

      {gallery && (
        <Lightbox
          items={gallery.items}
          index={gallery.index}
          onClose={() => setGallery(null)}
          onIndex={(i) => setGallery((g) => (g ? { ...g, index: i } : g))}
        />
      )}
    </div>
  );
}

/* =============================== HEADER =============================== */

function Header({
  menu,
  setMenu,
  goto,
}: {
  menu: boolean;
  setMenu: (v: boolean) => void;
  goto: (id: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b bg-paper/95 backdrop-blur transition-shadow duration-500 ${
          scrolled ? "border-line shadow-[0_4px_24px_-12px_rgba(18,43,41,.25)]" : "border-transparent"
        }`}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6">
          <button onClick={() => goto("top")} aria-label="Ir al inicio" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ocean text-white">
              <Waves size={18} />
            </span>
            <span className="font-display text-[16.5px] font-extrabold leading-tight text-carbon">
              Taxi Service
              <br className="hidden sm:block" /> Talara
            </span>
          </button>

          <nav className="hidden items-center text-carbon xl:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => goto(n.id)}
                className="nav-link whitespace-nowrap rounded-lg px-2.5 py-2 font-display text-[13.5px] font-semibold"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={waHref()}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full bg-wa px-5 py-2.5 font-display text-[14px] font-bold text-white shadow-[0_8px_22px_-8px_rgba(37,211,102,.8)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:inline-flex"
            >
              <WhatsAppIcon size={16} /> Reservar
            </a>
            <button
              className="rounded-xl p-2.5 text-carbon transition-colors hover:bg-mist xl:hidden"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menu}
            >
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-40 xl:hidden ${menu ? "" : "pointer-events-none"}`} aria-hidden={!menu}>
        <div
          className={`absolute inset-0 bg-ink/60 transition-opacity duration-400 ${menu ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenu(false)}
        />
        <div
          className={`absolute inset-x-0 top-[68px] max-h-[calc(100dvh-68px)] overflow-y-auto rounded-b-3xl border-b border-line bg-paper p-5 shadow-lift transition-all duration-400 ${
            menu ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="flex flex-col">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => goto(n.id)}
                className="flex items-center justify-between border-b border-line py-3.5 text-left font-display text-lg font-bold text-carbon last:border-0"
              >
                {n.label}
                <ArrowRight size={17} className="text-steel" />
              </button>
            ))}
          </nav>
          <a
            href={waHref()}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-wa py-3.5 font-display font-bold text-white"
          >
            <WhatsAppIcon size={18} /> Reservar por WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

/* ================================ HERO ================================ */

/** Foto de portada: una de las fotos reales de Cabo Blanco. */
const HERO_IMG = "/cabo-blanco/cabo-blanco-2.jpeg";

function Hero({ goto }: { goto: (id: string) => void }) {
  const [sinFoto, setSinFoto] = useState(false);

  return (
    <section className="relative isolate flex min-h-[86svh] flex-col justify-end overflow-hidden bg-ink pt-[68px] text-white">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_15%,#1f4d49_0%,#123230_55%,#0f2624_100%)]" />

        {!sinFoto && (
          <img
            src={HERO_IMG}
            alt=""
            onError={() => setSinFoto(true)}
            fetchPriority="high"
            decoding="async"
            className="anim-kenburns absolute inset-0 h-full w-full object-cover object-center"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/45" />
        <div className="grain absolute inset-0 opacity-30" />
      </div>

      <div className="shell flex flex-1 items-center py-16 lg:py-20">
        <div className="max-w-2xl">
          <Reveal>
            <p className="label-mono flex items-center gap-3 text-sun">
              <span className="h-px w-8 bg-sun/50" />
              Talara, Piura
            </p>
          </Reveal>

          <Reveal delay={110}>
            <h1 className="h-hero mt-6">
              Vive las playas
              <br />
              de Talara.
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-7 max-w-lg text-[17px] leading-relaxed text-white/75">
              Traslados a Cabo Blanco, Punta Sal y Punta Veleros, y servicio de van, camioneta o bus
              turístico. Coordinás todo por WhatsApp.
            </p>
          </Reveal>

          <Reveal delay={310}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Btn variant="wa" href={waHref()}>
                <WhatsAppIcon size={18} /> Reservar por WhatsApp
              </Btn>
              <Btn variant="ghost" onClick={() => goto("destinos")}>
                Ver destinos <ArrowRight size={18} />
              </Btn>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative border-t border-white/12 bg-ink/40 backdrop-blur-sm">
        <div className="shell flex flex-wrap items-center gap-x-8 gap-y-3 py-5">
          {HIGHLIGHTS.map((h) => (
            <p key={h} className="flex items-center gap-2 text-[13px] text-white/70">
              <Check size={15} className="text-sun" /> {h}
            </p>
          ))}
          <button
            onClick={() => goto("servicios")}
            className="ml-auto hidden font-display text-[11px] font-bold uppercase tracking-[0.16em] text-white/45 transition-colors hover:text-sun lg:block"
          >
            Ver servicios ↓
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================= HIGHLIGHTS ============================== */

const CAPS = [
  [Waves, "Playas de la zona", "Cabo Blanco, Punta Sal y Punta Veleros"],
  [Car, "Van, camioneta o bus", "Según el tamaño de tu grupo"],
  [Sparkles, "Traslados a medida", "Rutas y horarios que coordinás vos"],
  [ShieldCheck, "Reserva directa", "Por WhatsApp o llamada, sin apps"],
] as const;

function Highlights() {
  return (
    <section className="bg-ink">
      <div className="shell grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {CAPS.map(([Ic, t, d], i) => (
          <Reveal key={t} delay={i * 80}>
            <div
              className={`group flex h-full items-start gap-3.5 border-white/8 py-7 sm:pr-6 ${
                i % 2 ? "sm:border-l sm:pl-6" : "sm:pl-0"
              } ${i ? "lg:border-l lg:pl-6" : "lg:pl-0"}`}
            >
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-sun/25 bg-sun/10 text-sun transition-all duration-300 group-hover:scale-110 group-hover:bg-sun group-hover:text-ink">
                <Ic size={17} />
              </span>
              <span>
                <span className="block font-display text-[15px] font-bold text-white">{t}</span>
                <span className="mt-1 block text-[12.5px] leading-snug text-steel-2">{d}</span>
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ============================== GALERÍA ============================== */

/** Una celda de la grilla: foto o fotograma de video, con su overlay. */
function MediaCell({
  m,
  onClick,
  overlay,
  className = "",
}: {
  m: Media;
  onClick: () => void;
  overlay?: string | number;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={m.type === "video" ? "Reproducir video" : "Ver foto en grande"}
      className={`group relative overflow-hidden bg-mist ${className}`}
    >
      {m.type === "video" ? (
        <video src={m.src} className="h-full w-full object-cover" muted playsInline preload="metadata" />
      ) : (
        <img
          src={m.src}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      {m.type === "video" && overlay === undefined && (
        <span className="absolute inset-0 grid place-items-center bg-ink/25">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink">
            <Play size={15} className="translate-x-0.5" fill="currentColor" />
          </span>
        </span>
      )}
      {overlay !== undefined && (
        <span className="absolute inset-0 grid place-items-center bg-ink/55 font-display text-[15px] font-bold text-white">
          +{overlay}
        </span>
      )}
    </button>
  );
}

/**
 * Grilla de fotos/video de un destino o servicio. Se adapta a la
 * cantidad real de piezas en vez de dejar huecos vacíos: 1 foto ocupa
 * todo el ancho, 2 se reparten en mitades, 3 arma una grande + dos
 * apiladas, y de 4 en adelante la última miniatura muestra "+N".
 */
function MediaGrid({
  media,
  onOpen,
  className = "",
}: {
  media: Media[];
  onOpen: (index: number) => void;
  className?: string;
}) {
  if (media.length === 0) return null;
  const cell = "rounded-none first:rounded-l-2xl last:rounded-r-2xl";

  if (media.length === 1) {
    return (
      <div className={`h-64 ${className}`}>
        <MediaCell m={media[0]} onClick={() => onOpen(0)} className="h-full w-full rounded-2xl" />
      </div>
    );
  }

  if (media.length === 2) {
    return (
      <div className={`grid h-64 grid-cols-2 gap-1.5 ${className}`}>
        {media.map((m, i) => (
          <MediaCell key={m.src} m={m} onClick={() => onOpen(i)} className={`h-full w-full ${cell}`} />
        ))}
      </div>
    );
  }

  if (media.length === 3) {
    return (
      <div className={`grid h-64 grid-cols-3 grid-rows-2 gap-1.5 ${className}`}>
        <MediaCell m={media[0]} onClick={() => onOpen(0)} className="col-span-2 row-span-2 rounded-l-2xl" />
        <MediaCell m={media[1]} onClick={() => onOpen(1)} className="rounded-tr-2xl" />
        <MediaCell m={media[2]} onClick={() => onOpen(2)} className="rounded-br-2xl" />
      </div>
    );
  }

  const visible = media.slice(0, 4);
  const extra = media.length - visible.length;

  return (
    <div className={`grid h-64 grid-cols-4 grid-rows-2 gap-1.5 ${className}`}>
      {visible.map((m, i) => (
        <MediaCell
          key={m.src}
          m={m}
          onClick={() => onOpen(i)}
          overlay={i === visible.length - 1 && extra > 0 ? extra : undefined}
          className={`${i === 0 ? "col-span-2 row-span-2 rounded-l-2xl" : ""} ${i === 1 ? "rounded-tr-2xl" : ""} ${
            i === visible.length - 1 ? "rounded-br-2xl" : ""
          }`}
        />
      ))}
    </div>
  );
}

/* ============================== DESTINOS ============================== */

function DestinationCard({ d, delay, onNavigate }: { d: Destination; delay: number; onNavigate: (id: string) => void }) {
  return (
    <Reveal delay={delay}>
      <article className="lift overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <MediaGrid media={d.media} onOpen={() => onNavigate(d.id)} />
        <div className="p-6">
          <h3 className="font-display text-[19px] font-extrabold text-carbon">{d.label}</h3>
          <p className="mt-1 text-[13px] font-medium text-ocean-deep">{d.tagline}</p>
          <p className="mt-3 text-[14px] leading-relaxed text-steel">{d.desc}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate(d.id)}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 font-display text-[13px] font-bold text-carbon transition-all duration-300 hover:border-carbon/35 hover:bg-mist"
            >
              <Images size={15} /> Ver destino
            </button>
            <a
              href={waHref(`Hola, quisiera coordinar un traslado a ${d.label}.`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-wa px-4 py-2.5 font-display text-[13px] font-bold text-white transition-all duration-300 hover:brightness-110"
            >
              <WhatsAppIcon size={15} /> Reservar traslado
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function Destinations({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section id="destinos" className="bg-paper py-20 lg:py-24">
      <div className="shell">
        <Reveal>
          <Eyebrow>Destinos</Eyebrow>
        </Reveal>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <Reveal delay={80}>
            <h2 className="h-section text-carbon">A dónde te llevamos</h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-sm text-[14.5px] leading-relaxed text-steel">
              Las playas más visitadas cerca de Talara, a coordinar como traslado o como paseo del día.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {DESTINATIONS.map((d, i) => (
            <DestinationCard key={d.id} d={d} delay={i * 100} onNavigate={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== SERVICIOS ============================== */

const SERVICE_ICON: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  "servicio-van-turistica": Car,
  "alquiler-camionetas": Truck,
  "servicio-turistico-de-bus": Bus,
};

function ServiceCard({ s, delay, onOpen }: { s: Service; delay: number; onOpen: (items: Media[], i: number) => void }) {
  const Icon = SERVICE_ICON[s.id] ?? Car;

  return (
    <Reveal delay={delay}>
      <article className="lift flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        {s.media.length > 0 ? (
          <MediaGrid media={s.media} onOpen={(i) => onOpen(s.media, i)} className="h-48" />
        ) : (
          <div className="grid h-48 place-items-center bg-mist text-ocean-deep">
            <Icon size={34} />
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-[17px] font-extrabold text-carbon">{s.label}</h3>
          <p className="mt-2 flex-1 text-[14px] leading-relaxed text-steel">{s.desc}</p>
          <a
            href={waHref(`Hola, quisiera cotizar ${s.label.toLowerCase()}.`)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-wa px-4 py-2.5 font-display text-[13px] font-bold text-white transition-all duration-300 hover:brightness-110"
          >
            <WhatsAppIcon size={15} /> Cotizar por WhatsApp
          </a>
        </div>
      </article>
    </Reveal>
  );
}

/** Burbuja de texto: descripción real de un servicio que aún no tiene foto propia. */
function ServiceBubble({ note }: { note: ServiceNote }) {
  return (
    <div className="relative rounded-3xl rounded-tl-md border border-line bg-white p-5 shadow-card">
      <p className="font-display text-[14px] font-extrabold text-carbon">{note.label}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-steel">{note.desc}</p>
    </div>
  );
}

function Services({ onOpen, onGoFares }: { onOpen: (items: Media[], i: number) => void; onGoFares: () => void }) {
  return (
    <section id="servicios" className="border-y border-line bg-mist py-20 lg:py-24">
      <div className="shell">
        <Reveal>
          <Eyebrow>Servicios</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="h-section mb-12 max-w-xl text-carbon">Cómo te movemos</h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} s={s} delay={i * 100} onOpen={onOpen} />
          ))}
        </div>

        <div className="mt-14">
          <Reveal>
            <p className="label-mono mb-5 text-ocean-deep">También ofrecemos</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_NOTES.map((n, i) => (
              <Reveal key={n.label} delay={i * 90}>
                <ServiceBubble note={n} />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={200}>
          <p className="mt-10 text-[14px] text-steel">
            Ver tarifas y condiciones de reserva en{" "}
            <button
              onClick={onGoFares}
              className="font-semibold text-ocean-deep underline underline-offset-2"
            >
              Tarifas y Reservas
            </button>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================== NOSOTROS ============================== */

const TILES = [
  [MapPin, "Base en Talara", "Cobertura en la ciudad y balnearios cercanos"],
  [Waves, "Conoce la zona", "Rutas a las playas más visitadas de la costa"],
  [Car, "Flota variada", "Van, camioneta o bus según el grupo"],
  [ShieldCheck, "Coordinación clara", "Reserva y confirmación directa por WhatsApp"],
] as const;

function About() {
  return (
    <section id="nosotros" className="relative isolate overflow-hidden bg-ink py-20 text-white lg:py-24">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_15%_0%,#1c433f,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_95%_90%,rgba(232,163,61,.12),transparent_70%)]" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow light>Nosotros</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="h-section">Transporte y turismo local en Talara.</h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 text-[16px] leading-relaxed text-steel-2">{ABOUT.quienesSomos}</p>
          </Reveal>

          <Reveal delay={210}>
            <div className="mt-8 grid gap-5 border-t border-white/10 pt-8 sm:grid-cols-2">
              <div>
                <p className="label-mono text-sun">Visión</p>
                <p className="mt-2 text-[14px] leading-relaxed text-steel-2">{ABOUT.vision}</p>
              </div>
              <div>
                <p className="label-mono text-sun">Misión</p>
                <p className="mt-2 text-[14px] leading-relaxed text-steel-2">{ABOUT.mision}</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {TILES.map(([Ic, t, d], i) => (
            <Reveal key={t} delay={i * 100}>
              <div className="group flex h-full min-h-40 flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors duration-400 hover:bg-white/10">
                <Ic size={24} className="text-sun transition-transform duration-400 group-hover:scale-110" />
                <div className="mt-6">
                  <p className="font-display text-[15px] font-bold leading-snug">{t}</p>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-steel-2">{d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== CONTACTO ============================== */

function Contact() {
  return (
    <section id="contacto" className="bg-paper py-20 lg:py-24">
      <div className="shell">
        <Reveal>
          <Eyebrow>Contacto</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="h-section mb-12 max-w-xl text-carbon">Reserva tu traslado</h2>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <a
              href={waHref()}
              target="_blank"
              rel="noreferrer"
              className="lift group flex h-full items-center gap-4 rounded-2xl bg-wa p-6 text-white shadow-card"
            >
              <WhatsAppIcon size={30} />
              <span className="min-w-0">
                <span className="block font-display text-[17.5px] font-extrabold">Escribinos por WhatsApp</span>
                <span className="block text-[13.5px] opacity-90">La vía más rápida para reservar</span>
              </span>
              <ArrowUpRight size={20} className="arrow-go ml-auto shrink-0" />
            </a>
          </Reveal>

          <Reveal delay={80}>
            <div className="grid h-full gap-4 sm:grid-cols-2">
              {(
                [
                  [Phone, "Teléfono", CONTACT.phone, CONTACT.phoneHref],
                  [Mail, "Email", CONTACT.email, `mailto:${CONTACT.email}`],
                  [MapPin, "Dirección", CONTACT.address, null],
                  [FacebookIcon, "Facebook", "TAXISERVICETALARA", CONTACT.facebook],
                ] as const
              ).map(([Ic, t, d, href]) => {
                const inner = (
                  <>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mist text-ocean-deep transition-colors duration-300 group-hover:bg-sun group-hover:text-ink">
                      <Ic size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className="label-mono block text-[10px] text-steel">{t}</span>
                      <span className="mt-1 block truncate text-[13.5px] font-medium text-carbon">{d}</span>
                    </span>
                  </>
                );
                return href ? (
                  <a
                    key={t}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-sun/50 hover:shadow-card"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={t} className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
                    {inner}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* =============================== FOOTER =============================== */

function Footer({ goto }: { goto: (id: string) => void }) {
  return (
    <footer className="relative isolate overflow-hidden bg-ink text-white">
      <div className="grain absolute inset-0 -z-10" aria-hidden="true" />
      <div className="shell grid gap-10 py-14 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-sun">
              <Waves size={18} />
            </span>
            <span className="font-display text-[16.5px] font-extrabold">Taxi Service Talara</span>
          </div>
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-steel-2">
            Traslados y turismo en Talara: Cabo Blanco, Punta Sal, Punta Veleros y servicio de van,
            camioneta o bus. Reserva directa por WhatsApp.
          </p>
          <div className="mt-6 flex gap-2">
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-steel-2 transition-colors duration-300 hover:border-sun/40 hover:bg-sun/15 hover:text-sun"
            >
              <FacebookIcon size={16} />
            </a>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-steel-2 transition-colors duration-300 hover:border-sun/40 hover:bg-sun/15 hover:text-sun"
            >
              <InstagramIcon size={16} />
            </a>
          </div>
        </div>

        <div>
          <p className="label-mono text-sun">Navegar</p>
          <div className="mt-4 flex flex-col items-start gap-2.5">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => goto(n.id)}
                className="text-[14px] text-steel-2 transition-colors hover:text-white"
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="label-mono text-sun">Contacto</p>
          <a href={CONTACT.phoneHref} className="mt-4 block text-[14px] text-steel-2 transition-colors hover:text-white">
            {CONTACT.phone}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="mt-2 block text-[14px] text-steel-2 transition-colors hover:text-white"
          >
            {CONTACT.email}
          </a>
          <p className="mt-2 text-[14px] text-steel-2">{CONTACT.area}</p>
        </div>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-3 border-t border-white/8 py-5">
        <p className="text-[12.5px] text-steel-2/70">© {new Date().getFullYear()} Taxi Service Talara</p>
        <p className="text-[12.5px] text-steel-2/70">{CONTACT.area}</p>
      </div>
    </footer>
  );
}

/* ============================== ICONOS ============================== */

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.5 1.34 5.02L2 22l5.13-1.35A9.96 9.96 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.15a8.13 8.13 0 0 1-4.15-1.14l-.3-.18-3.05.8.82-2.97-.2-.3a8.15 8.15 0 1 1 6.88 3.79Zm4.47-6.1c-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.97-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.59 4.11 3.63.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.5c0-.87.24-1.46 1.5-1.46h1.6V4.36C16.3 4.25 15.4 4.16 14.35 4.16c-2.4 0-4.05 1.47-4.05 4.16V10.5H7.8v3h2.5V21h3.2Z" />
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
