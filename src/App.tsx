import { useEffect, useState } from "react";
import { Clock, Mail, MapPin, Menu, Phone, X, BookOpen } from "lucide-react";
import { COMPANY, NAV, SERVICES, img, mailHref, telHref, waLink } from "./data";
import { RouteContext, useRevealOnScroll, useRouteState } from "./hooks";
import { Link, WaIcon, btnClass } from "./ui";
import { AboutPage, ComplaintsPage, ContactPage, FleetPage, HomePage, NotFoundPage, ServicesPage } from "./pages";

const TITLES: Record<string, string> = {
  "/": "Transportes Tomy D. — Transporte de personal y servicio turístico",
  "/nosotros": "Nosotros — Transportes Tomy D.",
  "/servicios": "Servicios — Transportes Tomy D.",
  "/flota": "Nuestra flota — Transportes Tomy D.",
  "/contacto": "Contacto y cotizaciones — Transportes Tomy D.",
  "/libro-de-reclamaciones": "Libro de Reclamaciones — Transportes Tomy D.",
};

const OLD_URLS: Record<string, string> = {
  "/inicio": "/",
  "/contactos": "/contacto",
  "/galeria": "/flota",
  "/blog": "/",
};

export default function App() {
  const route = useRouteState();
  useRevealOnScroll();

  // Direcciones del WordPress anterior → páginas nuevas (Google ya las tiene indexadas).
  const alias = OLD_URLS[route.path];
  useEffect(() => {
    if (alias) window.history.replaceState({}, "", alias);
  }, [alias]);
  const path = alias ?? route.path;

  useEffect(() => {
    document.title = TITLES[path] ?? "Página no encontrada — Transportes Tomy D.";
  }, [path]);

  const page = (() => {
    switch (path) {
      case "/":
        return <HomePage />;
      case "/nosotros":
        return <AboutPage />;
      case "/servicios":
        return <ServicesPage />;
      case "/flota":
        return <FleetPage />;
      case "/contacto":
        return <ContactPage />;
      case "/libro-de-reclamaciones":
        return <ComplaintsPage />;
      default:
        return <NotFoundPage />;
    }
  })();

  return (
    <RouteContext.Provider value={route}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Ir al contenido
      </a>
      <TopBar />
      <Header />
      <main id="main">{page}</main>
      <Footer />
      <WhatsAppFloat />
    </RouteContext.Provider>
  );
}

/* ------------------------------------------------------------------ */

function TopBar() {
  return (
    <div className="hidden bg-navy-deep text-[13px] text-white/80 md:block">
      <div className="shell flex h-10 items-center justify-between">
        <div className="flex items-center gap-6">
          <a href={telHref} className="flex items-center gap-2 hover:text-white">
            <Phone className="size-3.5 text-road" /> {COMPANY.phoneDisplay}
          </a>
          <a href={mailHref} className="flex items-center gap-2 hover:text-white">
            <Mail className="size-3.5 text-road" /> {COMPANY.email}
          </a>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <Clock className="size-3.5 text-road" /> {COMPANY.hours}
          </span>
          <Socials />
        </div>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? "border-line shadow-[0_8px_30px_-12px_rgba(14,18,56,.25)]" : "border-transparent"
      }`}
    >
      <div className="shell flex h-[76px] items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={img("logo-mark.png")} alt="" width={93} height={56} className="h-11 w-auto shrink-0 sm:h-14" />
          <span className="leading-tight">
            <span className="block font-display text-[17px] font-extrabold tracking-tight whitespace-nowrap text-navy sm:text-[19px]">
              Transportes <span className="text-road">Tomy D.</span>
            </span>
            <span className="hidden text-[11px] font-semibold tracking-[.12em] text-steel uppercase sm:block">
              {COMPANY.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="nav-link rounded-lg px-3.5 py-2.5 text-[15px] font-semibold text-ink/80 hover:text-navy aria-[current=page]:text-navy">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/contacto#cotizar" className={btnClass("red", "!px-5 !py-3 text-[15px] max-md:!hidden")}>
            Solicita una cotización
          </Link>
          <button
            className="grid size-11 place-items-center rounded-xl text-navy hover:bg-mist lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="anim-pop fixed inset-x-0 top-[76px] bottom-0 overflow-y-auto border-t border-line bg-white lg:hidden">
          <nav className="shell flex flex-col py-4" aria-label="Móvil">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 font-display text-lg font-bold text-ink aria-[current=page]:text-road"
              >
                {n.label}
              </Link>
            ))}
            <Link to="/contacto#cotizar" onClick={() => setOpen(false)} className={btnClass("red", "mt-6")}>
              Solicita una cotización
            </Link>
            <a href={waLink()} target="_blank" rel="noreferrer" className={btnClass("wa", "mt-3")}>
              <WaIcon /> Escríbenos por WhatsApp
            </a>
            <a href={telHref} className={btnClass("outline", "mt-3")}>
              <Phone className="size-4" /> Llamar al {COMPANY.phoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="bg-navy-deep text-white/75">
      <div className="road-line rounded-none" aria-hidden="true" />
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <div className="inline-block rounded-2xl bg-white p-3">
            <img src={img("logo-full.png")} alt={COMPANY.legalName} width={180} height={142} className="h-auto w-44" />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Transporte de personal, turismo y traslados privados. Puntuales, seguros y cómodos.
          </p>
          <div className="mt-5">
            <Socials big />
          </div>
        </div>

        <div>
          <h3 className="label-caps mb-4 text-white">Navegación</h3>
          <ul className="space-y-2.5 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-white">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label-caps mb-4 text-white">Servicios</h3>
          <ul className="space-y-2.5 text-sm">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <Link to={`/servicios#${s.id}`} className="hover:text-white">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label-caps mb-4 text-white">Contacto</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={telHref} className="flex items-start gap-3 hover:text-white">
                <Phone className="mt-0.5 size-4 shrink-0 text-road" /> {COMPANY.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={mailHref} className="flex items-start gap-3 break-all hover:text-white">
                <Mail className="mt-0.5 size-4 shrink-0 text-road" /> {COMPANY.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-road" /> {COMPANY.address || COMPANY.city}
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-road" /> {COMPANY.hours}
            </li>
          </ul>
          <Link
            to="/libro-de-reclamaciones"
            className="mt-6 inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            <BookOpen className="size-6 text-road" />
            Libro de Reclamaciones
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-1 py-5 text-xs text-white/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {COMPANY.legalName} Todos los derechos reservados.</p>
          {COMPANY.ruc && <p>RUC {COMPANY.ruc}</p>}
        </div>
      </div>
    </footer>
  );
}

function Socials({ big = false }: { big?: boolean }) {
  const items = [
    { href: COMPANY.facebook, label: "Facebook", d: "M14 8h3V4h-3c-2.8 0-4.5 1.9-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8Z" },
    { href: COMPANY.instagram, label: "Instagram", d: "M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.9-7.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3.6c2.7 0 3 0 4.1.1 2.7.1 4 1.4 4.1 4.1.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.7-1.4 4-4.1 4.1-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.7-.1-4-1.4-4.1-4.1C3.7 15 3.6 14.7 3.6 12s0-3 .1-4.1C3.8 5.2 5.1 3.9 7.9 3.7 9 3.6 9.3 3.6 12 3.6Z" },
    { href: COMPANY.tiktok, label: "TikTok", d: "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z" },
  ].filter((s) => s.href);
  if (!items.length) return null;
  return (
    <div className="flex items-center gap-2">
      {items.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          className={`grid place-items-center rounded-full text-white/80 hover:text-white ${big ? "size-10 bg-white/10 hover:bg-road" : "size-6"}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className={big ? "size-5" : "size-4"} aria-hidden="true">
            <path d={s.d} />
          </svg>
        </a>
      ))}
    </div>
  );
}

function WhatsAppFloat() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed right-4 bottom-4 z-40 grid size-15 place-items-center rounded-full bg-wa text-white shadow-[0_14px_34px_-8px_rgba(37,211,102,.8)] transition hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <span className="anim-pulse-ring absolute inset-0 rounded-full bg-wa" aria-hidden="true" />
      <WaIcon className="relative size-8" />
    </a>
  );
}
