import { ArrowLeft, Play } from "lucide-react";
import type { Destination, Media } from "./data";
import { DESTINATIONS, WA } from "./data";
import { Btn, Eyebrow, Reveal } from "./ui";

const waHref = (msg?: string) =>
  `https://wa.me/${WA}?text=` + encodeURIComponent(msg ?? "Hola, quisiera coordinar un traslado en Talara.");

/** Página dedicada a un destino: toda su galería, descripción y CTA. */
export function DestinationPage({
  dest,
  onBack,
  onOpenLightbox,
  onNavigate,
}: {
  dest: Destination;
  onBack: () => void;
  onOpenLightbox: (items: Media[], index: number) => void;
  onNavigate: (id: string) => void;
}) {
  const [cover] = dest.media;
  const others = DESTINATIONS.filter((d) => d.id !== dest.id);

  return (
    <div className="pt-[68px]">
      <section className="relative isolate flex min-h-[56svh] flex-col justify-end overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          {cover && cover.type === "image" ? (
            <img src={cover.src} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_15%,#1f4d49_0%,#123230_55%,#0f2624_100%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15" />
          <div className="grain absolute inset-0 opacity-25" />
        </div>

        <div className="shell py-10">
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-display text-[13px] font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <ArrowLeft size={15} /> Volver a destinos
          </button>
          <p className="label-mono flex items-center gap-3 text-sun">
            <span className="h-px w-8 bg-sun/50" />
            {dest.tagline}
          </p>
          <h1 className="h-hero mt-4 max-w-2xl">{dest.label}</h1>
        </div>
      </section>

      <section className="bg-paper py-16 lg:py-20">
        <div className="shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <Reveal>
              <Eyebrow>Galería</Eyebrow>
            </Reveal>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {dest.media.map((m, i) => (
                <button
                  key={m.src}
                  onClick={() => onOpenLightbox(dest.media, i)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist"
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
                  {m.type === "video" && (
                    <span className="absolute inset-0 grid place-items-center bg-ink/25">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink">
                        <Play size={16} className="translate-x-0.5" fill="currentColor" />
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Reveal>
              <div className="rounded-3xl border border-line bg-white p-7 shadow-card lg:sticky lg:top-24">
                <h2 className="font-display text-[21px] font-extrabold text-carbon">Sobre {dest.label}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-steel">{dest.desc}</p>
                <Btn variant="wa" href={waHref(`Hola, quisiera coordinar un traslado a ${dest.label}.`)} className="mt-6 w-full">
                  <WhatsAppIcon size={18} /> Cotizar por WhatsApp
                </Btn>
                <p className="mt-2.5 text-center text-[12px] text-steel">
                  Sin tarifas publicadas: se cotiza según horario y tamaño del grupo.
                </p>
              </div>
            </Reveal>

            {others.length > 0 && (
              <Reveal delay={100} className="mt-8">
                <p className="label-mono text-ocean-deep">Otros destinos</p>
                <div className="mt-4 flex flex-col gap-3">
                  {others.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => onNavigate(d.id)}
                      className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-sun/50 hover:shadow-card"
                    >
                      {d.media[0] && (
                        <span className="block h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-mist">
                          {d.media[0].type === "image" ? (
                            <img src={d.media[0].src} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <video src={d.media[0].src} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                          )}
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block font-display text-[14.5px] font-bold text-carbon">{d.label}</span>
                        <span className="block truncate text-[12.5px] text-steel">{d.tagline}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.5 1.34 5.02L2 22l5.13-1.35A9.96 9.96 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.15a8.13 8.13 0 0 1-4.15-1.14l-.3-.18-3.05.8.82-2.97-.2-.3a8.15 8.15 0 1 1 6.88 3.79Zm4.47-6.1c-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.97-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.59 4.11 3.63.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}
