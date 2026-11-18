import { useEffect, useState, type ReactNode } from "react";
import {
  Armchair,
  ArrowRight,
  Bus,
  Car,
  Check,
  ChevronRight,
  Clock,
  Luggage,
  Mail,
  Map,
  MapPin,
  Phone,
  Plane,
  Route,
  ShieldCheck,
  Users,
} from "lucide-react";
import { COMPANY, FLEET, HERO_SLIDES, img, REASONS, SERVICES, STEPS, mailHref, telHref, waLink, type Service, type Vehicle } from "./data";
import { QuoteForm } from "./QuoteForm";
import { ComplaintForm } from "./ComplaintForm";
import { Eyebrow, ExtBtn, Link, Reveal, WaIcon, btnClass } from "./ui";

const SERVICE_ICON = { users: Users, map: Map, plane: Plane, car: Car, calendar: Clock } as const;
const REASON_ICON = { clock: Clock, shield: ShieldCheck, armchair: Armchair, route: Route } as const;

/* ================================================================== *
 *  INICIO
 * ================================================================== */

export function HomePage() {
  return (
    <>
      <Hero />
      <QuickQuote />
      <ServicesGrid />
      <AboutTeaser />
      <Reasons />
      <FleetTeaser />
      <Steps />
      <CtaBand />
    </>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-navy-deep text-white">
      {/* Fotos: a la derecha en escritorio, de fondo en móvil */}
      <div className="absolute inset-0 -z-10 overflow-hidden lg:left-[44%]">
        {HERO_SLIDES.map((src, n) => (
          <img
            key={src}
            src={src}
            alt=""
            fetchPriority={n === 0 ? "high" : "low"}
            className={`slide absolute inset-0 size-full object-cover ${n === i ? "scale-105 opacity-100" : "scale-100 opacity-0"}`}
          />
        ))}
        <div className="hero-veil absolute inset-0" />
      </div>
      {/* Carretera roja del logo, de adorno */}
      <svg className="pointer-events-none absolute -right-24 -bottom-10 -z-10 hidden h-[340px] w-[720px] opacity-90 lg:block" viewBox="0 0 720 340" fill="none" aria-hidden="true">
        <path d="M0 330 C 220 330, 300 250, 420 200 S 640 150, 720 40" stroke="#d4202f" strokeWidth="44" strokeLinecap="round" />
        <path d="M0 330 C 220 330, 300 250, 420 200 S 640 150, 720 40" stroke="#fff" strokeWidth="3" strokeDasharray="18 16" />
      </svg>

      <div className="shell relative pt-16 pb-36 sm:pt-24 lg:pt-28 lg:pb-44">
        <div className="max-w-xl">
          <Eyebrow light>Transporte de personal y turismo</Eyebrow>
          <h1 className="h-hero">
            Llevamos a tu gente <span className="text-road [text-shadow:0_2px_20px_rgba(0,0,0,.25)]">a tiempo</span>, todos los días.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-steel-2">
            Movilidad para empresas, turistas y viajes privados. Unidades cómodas, conductores con experiencia y rutas pensadas para ti.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ExtBtn href={waLink("Hola Transportes Tomy D., quisiera una cotización.")} variant="wa">
              <WaIcon /> Cotiza por WhatsApp
            </ExtBtn>
            <Link to="/servicios" className={btnClass("ghost")}>
              Ver servicios <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/90">
            {["Puntualidad garantizada", "Unidades con aire acondicionado", "Atención 24/7"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-road">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-24 left-4 flex gap-2 sm:left-6 lg:bottom-32 lg:left-8" role="tablist" aria-label="Fotos">
          {HERO_SLIDES.map((src, n) => (
            <button
              key={src}
              role="tab"
              aria-selected={n === i}
              aria-label={`Foto ${n + 1}`}
              onClick={() => setI(n)}
              className={`h-1.5 rounded-full transition-all ${n === i ? "w-8 bg-road" : "w-4 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickQuote() {
  return (
    <section className="relative z-10 -mt-20 lg:-mt-24">
      <div className="shell">
        <Reveal className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="label-caps text-road">Cotización rápida</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-navy">¿A dónde te llevamos?</h2>
            </div>
            <p className="text-sm text-steel">
              O llámanos al{" "}
              <a href={telHref} className="font-bold text-navy hover:text-road">
                {COMPANY.phoneDisplay}
              </a>
            </p>
          </div>
          <QuoteForm compact />
        </Reveal>
      </div>
    </section>
  );
}

function ServicesGrid() {
  return (
    <section className="py-20 sm:py-28">
      <div className="shell">
        <SectionHead eyebrow="Nuestros servicios" title="Movilidad para cada necesidad">
          Desde las rutas diarias de tu empresa hasta un tour por la ciudad: tenemos la unidad y el conductor ideal.
        </SectionHead>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, n) => (
            <Reveal key={s.id} delay={n * 80}>
              <ServiceCard s={s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ s }: { s: Service }) {
  const Icon = SERVICE_ICON[s.icon];
  return (
    <Link to={`/servicios#${s.id}`} className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="relative aspect-[16/10]">
        <div className="absolute inset-0 overflow-hidden">
          <img src={s.image} alt="" loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 to-transparent" />
        </div>
        <span className="absolute -bottom-6 left-5 grid size-12 place-items-center rounded-xl bg-road text-white shadow-lg">
          <Icon className="size-6" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 pt-9">
        <h3 className="font-display text-lg font-extrabold text-navy">{s.title}</h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-steel">{s.short}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-road">
          Más información <ChevronRight className="size-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function AboutTeaser() {
  return (
    <section className="bg-mist py-20 sm:py-28">
      <div className="shell grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative">
          <img src={img("elantra-azul.jpg")} alt="Una de nuestras unidades" loading="lazy" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
          <div className="absolute -right-2 -bottom-8 hidden w-56 rounded-2xl bg-navy p-5 text-white shadow-lift sm:block lg:-right-8">
            <img src={img("logo-mark.png")} alt="" className="mb-3 h-14 w-auto rounded-lg bg-white p-1" />
            <p className="font-display text-lg leading-snug font-extrabold">Servicio turístico y de personal</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <Eyebrow>Quiénes somos</Eyebrow>
          <h2 className="h-section text-navy">Una empresa de transporte en la que puedes confiar</h2>
          <p className="mt-5 text-lg leading-relaxed text-steel">
            En {COMPANY.legalName} nos dedicamos a mover personas con seguridad y puntualidad. Trabajamos con empresas que necesitan
            llevar a su personal cada día y con viajeros que quieren conocer la ciudad sin preocupaciones.
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {["Conductores con experiencia", "Unidades revisadas y limpias", "Rutas a la medida", "Trato amable y cercano"].map((t) => (
              <li key={t} className="flex items-center gap-3 font-semibold text-ink">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-road-soft text-road">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Link to="/nosotros" className={btnClass("navy", "mt-9")}>
            Conoce más de nosotros <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Reasons() {
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-24">
      <div className="shell">
        <SectionHead eyebrow="¿Por qué elegirnos?" title="Lo que nos diferencia" light />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r, n) => {
            const Icon = REASON_ICON[r.icon];
            return (
              <Reveal key={r.title} delay={n * 80} className="h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-white/[.06] p-6 transition hover:bg-white/10">
                  <span className="grid size-13 place-items-center rounded-2xl bg-road">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-extrabold">{r.title}</h3>
                  <p className="mt-2 leading-relaxed text-steel-2">{r.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FleetTeaser() {
  const picks = FLEET.filter((v) => v.image).slice(0, 3);
  return (
    <section className="py-20 sm:py-28">
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead eyebrow="Nuestra flota" title="Unidades cómodas y seguras" align="left">
            Sedanes, SUV y van para viajar solo, en familia o en grupo.
          </SectionHead>
          <Link to="/flota" className={btnClass("outline", "shrink-0")}>
            Ver toda la flota <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((v, n) => (
            <Reveal key={v.name} delay={n * 80}>
              <VehicleCard v={v} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="bg-mist py-20 sm:py-24">
      <div className="shell">
        <SectionHead eyebrow="Así de fácil" title="Reserva en 3 pasos" />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, n) => (
            <Reveal key={s.title} delay={n * 90}>
              <li className="relative h-full rounded-2xl bg-white p-7 shadow-card">
                <span className="font-display text-5xl font-extrabold text-road/30">0{n + 1}</span>
                <h3 className="mt-2 font-display text-xl font-extrabold text-navy">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-steel">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="py-20 sm:py-24">
      <div className="shell">
        <Reveal className="relative overflow-hidden rounded-3xl bg-road px-6 py-12 text-white sm:px-12 sm:py-14">
          <svg className="absolute -top-10 -right-10 h-64 w-64 opacity-15" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeWidth="6" />
          </svg>
          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="h-section">¿Necesitas movilidad para tu empresa o tu viaje?</h2>
              <p className="mt-3 text-lg text-white/85">Escríbenos y te enviamos una cotización sin compromiso.</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <ExtBtn href={waLink()} variant="wa">
                <WaIcon /> WhatsApp
              </ExtBtn>
              <ExtBtn href={telHref} variant="ghost">
                <Phone className="size-4" /> {COMPANY.phoneDisplay}
              </ExtBtn>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== *
 *  NOSOTROS
 * ================================================================== */

export function AboutPage() {
  return (
    <>
      <PageHero title="Nosotros" crumb="Nosotros" image={img("santafe-plata.jpg")}>
        Conoce a la empresa detrás de cada viaje.
      </PageHero>

      <section className="py-20 sm:py-24">
        <div className="shell grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Nuestra historia</Eyebrow>
            <h2 className="h-section text-navy">Moviendo personas con responsabilidad</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-steel">
              {/* PENDIENTE: reemplazar por la historia real de la empresa (año de fundación, fundador, etc.) */}
              <p>
                {COMPANY.legalName} nació con una idea simple: que viajar sea fácil, seguro y puntual. Empezamos llevando personal de
                empresas y hoy también acompañamos a turistas nacionales y extranjeros.
              </p>
              <p>
                Mantenemos nuestras unidades en perfecto estado y trabajamos con conductores responsables, porque sabemos que detrás de
                cada viaje hay personas que necesitan llegar bien.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <img src={img("sentra-plata.jpg")} alt="Una de nuestras unidades" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
          </Reveal>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-24">
        <div className="shell grid gap-6 md:grid-cols-3">
          {[
            { t: "Misión", d: "Brindar un servicio de transporte de personal y turismo seguro, puntual y cómodo, que supere las expectativas de nuestros clientes." },
            { t: "Visión", d: "Ser la empresa de transporte de referencia para las empresas y los viajeros que valoran la confianza y la puntualidad." },
            { t: "Valores", d: "Responsabilidad, puntualidad, respeto, seguridad y mejora continua en cada servicio que brindamos." },
          ].map((x, n) => (
            <Reveal key={x.t} delay={n * 80} className="h-full">
              <div className="h-full rounded-2xl border-t-4 border-road bg-white p-7 shadow-card">
                <h3 className="font-display text-2xl font-extrabold text-navy">{x.t}</h3>
                <p className="mt-3 leading-relaxed text-steel">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reasons />
      <CtaBand />
    </>
  );
}

/* ================================================================== *
 *  SERVICIOS
 * ================================================================== */

export function ServicesPage() {
  return (
    <>
      <PageHero title="Nuestros servicios" crumb="Servicios" image={img("xtrail-rojo.jpg")}>
        Transporte de personal, turismo, traslados y viajes privados.
      </PageHero>

      <section className="py-20 sm:py-24">
        <div className="shell space-y-20 sm:space-y-28">
          {SERVICES.map((s, n) => {
            const Icon = SERVICE_ICON[s.icon];
            return (
              <article key={s.id} id={s.id} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <Reveal className={n % 2 ? "lg:order-2" : ""}>
                  <div className="relative">
                    <img src={s.image} alt="" loading="lazy" className="aspect-[16/11] w-full rounded-3xl object-cover shadow-lift" />
                    <span className={`absolute -bottom-6 grid size-16 place-items-center rounded-2xl bg-road text-white shadow-lift ${n % 2 ? "right-6" : "left-6"}`}>
                      <Icon className="size-8" />
                    </span>
                  </div>
                </Reveal>
                <Reveal delay={100}>
                  <p className="label-caps text-road">Servicio 0{n + 1}</p>
                  <h2 className="h-section mt-2 text-navy">{s.title}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-steel">{s.long}</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 font-medium text-ink">
                        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-road-soft text-road">
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <ExtBtn href={waLink(`Hola Transportes Tomy D., estoy interesado en el servicio: ${s.title}.`)} variant="wa" className="mt-8">
                    <WaIcon /> Cotizar este servicio
                  </ExtBtn>
                </Reveal>
              </article>
            );
          })}
        </div>
      </section>
      <Steps />
      <CtaBand />
    </>
  );
}

/* ================================================================== *
 *  FLOTA
 * ================================================================== */

const FLEET_TYPES = ["Todas", "Van", "SUV", "Sedán"] as const;

export function FleetPage() {
  const [type, setType] = useState<(typeof FLEET_TYPES)[number]>("Todas");
  const list = FLEET.filter((v) => type === "Todas" || v.type === type);
  return (
    <>
      <PageHero title="Nuestra flota" crumb="Flota" image={img("sportage-blanco.jpg")}>
        Unidades limpias, revisadas y con aire acondicionado.
      </PageHero>
      <section className="py-16 sm:py-20">
        <div className="shell">
          <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Tipo de vehículo">
            {FLEET_TYPES.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={t === type}
                onClick={() => setType(t)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  t === type ? "bg-navy text-white" : "bg-mist text-navy hover:bg-line"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((v) => (
              <VehicleCard key={v.name} v={v} />
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

function VehicleCard({ v }: { v: Vehicle }) {
  return (
    <article className="lift flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        {v.image ? (
          <img src={v.image} alt={v.name} loading="lazy" className="size-full object-cover" />
        ) : (
          <div className="grid size-full place-items-center bg-gradient-to-br from-navy to-navy-deep text-white/80">
            <div className="text-center">
              <Bus className="mx-auto size-14" strokeWidth={1.4} />
              <p className="mt-2 text-sm">Foto próximamente</p>
            </div>
          </div>
        )}
        <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold tracking-wide text-navy uppercase">
          {v.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-extrabold text-navy">{v.name}</h3>
        <div className="mt-3 flex gap-5 text-sm font-semibold text-ink">
          <span className="flex items-center gap-1.5">
            <Users className="size-4 text-road" /> Hasta {v.seats} pasajeros
          </span>
          <span className="flex items-center gap-1.5">
            <Luggage className="size-4 text-road" /> {v.luggage}
          </span>
        </div>
        <ul className="mt-4 flex-1 space-y-1.5 text-sm text-steel">
          {v.features.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <Check className="size-3.5 text-road" strokeWidth={3} /> {f}
            </li>
          ))}
        </ul>
        <ExtBtn
          href={waLink(`Hola Transportes Tomy D., solicito información de la unidad: ${v.name} (${v.type}).`)}
          variant="outline"
          className="mt-6 !py-3"
        >
          <WaIcon className="size-4 text-wa" /> Solicitar esta unidad
        </ExtBtn>
      </div>
    </article>
  );
}

/* ================================================================== *
 *  CONTACTO
 * ================================================================== */

export function ContactPage() {
  const cards = [
    { icon: Phone, title: "Llámanos", text: COMPANY.phoneDisplay, href: telHref },
    { icon: WaIcon, title: "WhatsApp", text: COMPANY.phoneDisplay, href: waLink() },
    { icon: Mail, title: "Correo", text: COMPANY.email, href: mailHref },
    { icon: MapPin, title: "Ubicación", text: COMPANY.address || COMPANY.city },
  ];
  return (
    <>
      <PageHero title="Contáctanos" crumb="Contacto" image={img("elantra-plata.jpg")}>
        Escríbenos o llámanos: te respondemos rápido.
      </PageHero>
      <section className="py-16 sm:py-20">
        <div className="shell">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => {
              const inner = (
                <>
                  <span className="grid size-12 place-items-center rounded-xl bg-road-soft text-road">
                    <c.icon className="size-6" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-steel">{c.title}</span>
                    <span className="block font-display font-extrabold break-all text-navy">{c.text}</span>
                  </span>
                </>
              );
              const cls = "flex h-full items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card";
              return c.href ? (
                <a key={c.title} href={c.href} className={`${cls} lift`} {...(c.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                  {inner}
                </a>
              ) : (
                <div key={c.title} className={cls}>
                  {inner}
                </div>
              );
            })}
          </div>

          <div id="cotizar" className="mt-14 grid scroll-mt-28 gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <Eyebrow>Cotización</Eyebrow>
              <h2 className="h-section text-navy">Solicita una cotización</h2>
              <p className="mt-4 text-lg leading-relaxed text-steel">
                Completa el formulario y se abrirá WhatsApp con tu pedido listo para enviar. Te responderemos con el precio y la unidad
                ideal para tu viaje.
              </p>
              <div className="mt-8 rounded-2xl bg-navy p-6 text-white">
                <p className="flex items-center gap-3 font-display text-lg font-extrabold">
                  <Clock className="size-5 text-road" /> {COMPANY.hours}
                </p>
                <p className="mt-2 text-steel-2">Para servicios de madrugada o urgentes, llámanos directamente.</p>
                <ExtBtn href={telHref} variant="red" className="mt-5">
                  <Phone className="size-4" /> Llamar ahora
                </ExtBtn>
              </div>
            </div>
            <div className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ================================================================== *
 *  LIBRO DE RECLAMACIONES
 * ================================================================== */

export function ComplaintsPage() {
  return (
    <>
      <PageHero title="Libro de Reclamaciones" crumb="Libro de Reclamaciones">
        Conforme al Código de Protección y Defensa del Consumidor.
      </PageHero>
      <section className="py-16 sm:py-20">
        <div className="shell max-w-4xl">
          <ComplaintForm />
        </div>
      </section>
    </>
  );
}

export function NotFoundPage() {
  return (
    <section className="py-32 text-center">
      <div className="shell">
        <p className="font-display text-7xl font-extrabold text-road">404</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-navy">Esta página no existe</h1>
        <p className="mt-3 text-steel">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
        <Link to="/" className={btnClass("navy", "mt-8")}>
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}

/* ================================================================== *
 *  Piezas comunes
 * ================================================================== */

function SectionHead({
  eyebrow,
  title,
  children,
  light = false,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  light?: boolean;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={`max-w-2xl ${align === "center" ? "mx-auto text-center [&>p:first-child]:justify-center" : ""}`}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2 className={`h-section ${light ? "text-white" : "text-navy"}`}>{title}</h2>
      {children && <p className={`mt-4 text-lg leading-relaxed ${light ? "text-steel-2" : "text-steel"}`}>{children}</p>}
    </Reveal>
  );
}

function PageHero({ title, crumb, image, children }: { title: string; crumb: string; image?: string; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep text-white">
      {image && <img src={image} alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-30" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy/50" />
      <div className="shell py-16 sm:py-20">
        <nav aria-label="Ruta" className="flex items-center gap-2 text-sm text-white/70">
          <Link to="/" className="hover:text-white">Inicio</Link>
          <ChevronRight className="size-4" />
          <span className="text-white">{crumb}</span>
        </nav>
        <h1 className="h-hero mt-4">{title}</h1>
        {children && <p className="mt-4 max-w-xl text-lg text-steel-2">{children}</p>}
      </div>
      <div className="road-line rounded-none" aria-hidden="true" />
    </section>
  );
}
