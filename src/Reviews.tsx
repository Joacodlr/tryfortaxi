import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, MessageSquareQuote, Send, Star } from "lucide-react";
import { DESTINATIONS, SERVICES } from "./data";
import { Eyebrow, Reveal } from "./ui";

/* ------------------------------------------------------------------ *
 *  Opiniones de pasajeros: formulario + listado, en la home.
 *  Se guardan con /api/reviews.php (ver public/api/reviews.php).
 * ------------------------------------------------------------------ */

type Review = {
  id: string;
  name: string;
  rating: number;
  service: string;
  comment: string;
  date: string;
};

/** Cuántas se muestran antes de "Ver más opiniones". */
const PAGE = 6;

const SERVICE_OPTIONS = [
  "Traslado al aeropuerto",
  ...DESTINATIONS.map((d) => `Viaje a ${d.label}`),
  ...SERVICES.map((s) => s.label),
  "Otro",
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="flex gap-0.5 text-sun" aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} fill={n <= Math.round(value) ? "currentColor" : "none"} strokeWidth={1.8} />
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Calificación" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          className="rounded-lg p-1 text-sun transition-transform hover:scale-115"
        >
          <Star size={30} fill={n <= shown ? "currentColor" : "none"} strokeWidth={1.6} />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <Stars value={r.rating} />
        <time className="text-[12px] text-steel" dateTime={r.date}>
          {fmtDate(r.date)}
        </time>
      </div>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink [overflow-wrap:anywhere]">“{r.comment}”</p>
      <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sea font-display text-[13px] font-bold uppercase text-white">
          {r.name.charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-[13.5px] font-bold text-carbon">{r.name}</span>
          {r.service && <span className="block truncate text-[12px] text-steel">{r.service}</span>}
        </span>
      </div>
    </article>
  );
}

const field =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink outline-none transition-colors placeholder:text-steel/70 focus:border-ocean";

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [shown, setShown] = useState(PAGE);

  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/reviews.php")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { reviews: Review[] }) => {
        if (!alive) return;
        setReviews(data.reviews);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!rating) return setFormError("Elige una calificación de 1 a 5 estrellas.");
    setSending(true);
    try {
      const res = await fetch("/api/reviews.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, service, rating, comment, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { review?: Review; error?: string };
      if (!res.ok) throw new Error(data.error ?? "No se pudo enviar tu opinión. Intenta de nuevo.");
      if (data.review) setReviews((list) => [data.review!, ...list]);
      setStatus("ready");
      setSent(true);
      setName("");
      setService("");
      setRating(0);
      setComment("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo enviar tu opinión.");
    } finally {
      setSending(false);
    }
  };

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <section id="opiniones" className="border-t border-line bg-mist py-20 lg:py-24">
      <div className="shell">
        <Reveal>
          <Eyebrow>Opiniones</Eyebrow>
        </Reveal>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <Reveal delay={80}>
            <h2 className="h-section text-carbon">Lo que dicen nuestros pasajeros</h2>
          </Reveal>
          {reviews.length > 0 && (
            <Reveal delay={140}>
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-3 shadow-card">
                <span className="font-display text-[28px] font-extrabold leading-none text-carbon">
                  {avg.toFixed(1)}
                </span>
                <span>
                  <Stars value={avg} size={15} />
                  <span className="mt-1 block text-[12px] text-steel">
                    {reviews.length} {reviews.length === 1 ? "opinión" : "opiniones"}
                  </span>
                </span>
              </div>
            </Reveal>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          {/* Listado */}
          <div className="order-2 min-w-0 lg:order-1">
            {status === "loading" && <p className="text-[14px] text-steel">Cargando opiniones…</p>}
            {status === "error" && reviews.length === 0 && (
              <p className="rounded-2xl border border-dashed border-line bg-white/60 p-6 text-[14px] text-steel">
                Las opiniones no se pudieron cargar en este momento.
              </p>
            )}
            {status === "ready" && reviews.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-white/60 p-10 text-center">
                <MessageSquareQuote size={30} className="text-ocean" />
                <p className="font-display text-[16px] font-bold text-carbon">Todavía no hay opiniones</p>
                <p className="text-[14px] text-steel">¿Viajaste con nosotros? Sé el primero en contarnos cómo te fue.</p>
              </div>
            )}
            {reviews.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {reviews.slice(0, shown).map((r) => (
                    <ReviewCard key={r.id} r={r} />
                  ))}
                </div>
                {reviews.length > shown && (
                  <button
                    onClick={() => setShown((n) => n + PAGE)}
                    className="mt-6 rounded-full border border-line bg-white px-5 py-2.5 font-display text-[13.5px] font-bold text-carbon transition-colors hover:border-carbon/35"
                  >
                    Ver más opiniones
                  </button>
                )}
              </>
            )}
          </div>

          {/* Formulario */}
          <div className="order-1 min-w-0 lg:order-2">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-card lg:sticky lg:top-24 lg:p-7">
              {sent ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <CheckCircle2 size={40} className="text-wa" />
                  <p className="font-display text-[18px] font-extrabold text-carbon">¡Gracias por tu opinión!</p>
                  <p className="text-[14px] text-steel">Ya aparece publicada en esta página.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-2 text-[13.5px] font-semibold text-ocean-deep underline underline-offset-2"
                  >
                    Enviar otra opinión
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-4">
                  <div>
                    <p className="font-display text-[18px] font-extrabold text-carbon">Califica nuestro servicio</p>
                    <p className="mt-1 text-[13.5px] text-steel">Tu opinión se publica aquí mismo.</p>
                  </div>

                  <StarPicker value={rating} onChange={setRating} />

                  <label className="flex flex-col gap-1.5">
                    <span className="text-[13px] font-semibold text-carbon">Nombre</span>
                    <input
                      className={field}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={60}
                      required
                      minLength={2}
                      autoComplete="given-name"
                      placeholder="Ej.: María G."
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-[13px] font-semibold text-carbon">
                      Servicio <span className="font-normal text-steel">(opcional)</span>
                    </span>
                    <select className={field} value={service} onChange={(e) => setService(e.target.value)}>
                      <option value="">Elegir…</option>
                      {SERVICE_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-[13px] font-semibold text-carbon">Tu comentario</span>
                    <textarea
                      className={`${field} min-h-28 resize-y`}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={600}
                      required
                      minLength={5}
                      placeholder="¿Cómo fue tu viaje con nosotros?"
                    />
                  </label>

                  {/* Campo trampa para bots: oculto para las personas. */}
                  <input
                    type="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  {formError && (
                    <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-[13.5px] text-danger" role="alert">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-sea px-6 py-3.5 font-display text-[14.5px] font-bold text-white shadow-[0_10px_30px_-10px_rgba(8,102,168,.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sea-deep disabled:opacity-60"
                  >
                    <Send size={16} /> {sending ? "Enviando…" : "Publicar opinión"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
