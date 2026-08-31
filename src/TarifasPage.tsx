import { Clock, CreditCard, Mail, MapPin, Phone, Wallet } from "lucide-react";
import { CONTACT, RESERVAS, TARIFAS, WA } from "./data";
import type { FareGroup } from "./data";
import { Btn, Eyebrow, Reveal } from "./ui";

const waHref = (msg?: string) =>
  `https://wa.me/${WA}?text=` + encodeURIComponent(msg ?? "Hola, quisiera hacer una reserva.");

function FareTable({ group }: { group: FareGroup }) {
  return (
    <div>
      <h3 className="font-display text-[14.5px] font-extrabold uppercase tracking-wide text-ocean-deep">
        {group.title}
      </h3>
      <ul className="mt-4 flex flex-col divide-y divide-line">
        {group.rows.map((r) => (
          <li key={r.name} className="py-3">
            <p className="font-display text-[14px] font-bold text-carbon">{r.name}</p>
            <p className="mt-0.5 text-[13px] text-steel">
              Auto: {r.auto} — VAN: {r.van}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Página "Tarifas y Reservas": precios reales por aeropuerto de salida. */
export function TarifasPage() {
  return (
    <div className="pt-[68px]">
      <section className="bg-ink py-14 text-white lg:py-16">
        <div className="shell">
          <p className="label-mono flex items-center gap-3 text-sun">
            <span className="h-px w-8 bg-sun/50" />
            <Wallet size={14} className="inline -mt-0.5" /> Tarifas y reservas
          </p>
          <h1 className="h-hero mt-4 max-w-2xl text-[2.4rem]">Cuánto cuesta tu traslado</h1>
        </div>
      </section>

      <section className="bg-paper py-16 lg:py-20">
        <div className="shell">
          <Reveal>
            <Eyebrow>Tarifas</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <p className="max-w-2xl text-[15px] leading-relaxed text-steel">
              Precios de referencia según punto de origen y destino. Ante cualquier duda, coordinalo
              directo por WhatsApp.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {TARIFAS.map((group, i) => (
              <Reveal key={group.title} delay={i * 100}>
                <div className="h-full rounded-3xl border border-line bg-white p-6 shadow-card lg:p-7">
                  <FareTable group={group} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-mist py-16 lg:py-20">
        <div className="shell">
          <Reveal>
            <Eyebrow>Reservas</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="h-section mb-10 max-w-xl text-carbon">Cómo reservar</h2>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col gap-4 rounded-3xl border border-line bg-white p-6 shadow-card">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mist text-ocean-deep">
                    <Clock size={17} />
                  </span>
                  <p className="text-[14.5px] leading-relaxed text-steel">{RESERVAS.note}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mist text-ocean-deep">
                    <CreditCard size={17} />
                  </span>
                  <p className="text-[14.5px] leading-relaxed text-steel">{RESERVAS.pago}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mist text-ocean-deep">
                    <MapPin size={17} />
                  </span>
                  <p className="text-[14.5px] leading-relaxed text-steel">{CONTACT.address}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="flex h-full flex-col justify-between gap-6 rounded-3xl bg-ink p-7 text-white shadow-card">
                <div>
                  <p className="font-display text-[17px] font-extrabold">Reservá ahora</p>
                  <a
                    href={CONTACT.phoneHref}
                    className="mt-4 flex items-center gap-2.5 text-[14.5px] text-steel-2 transition-colors hover:text-white"
                  >
                    <Phone size={16} /> {CONTACT.phone}
                  </a>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="mt-2.5 flex items-center gap-2.5 text-[14.5px] text-steel-2 transition-colors hover:text-white"
                  >
                    <Mail size={16} /> {CONTACT.email}
                  </a>
                </div>
                <Btn variant="wa" href={waHref()} className="w-full">
                  <WhatsAppIcon size={18} /> Reservar por WhatsApp
                </Btn>
              </div>
            </Reveal>
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
