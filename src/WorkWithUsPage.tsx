import { ArrowRight, Briefcase, Mail } from "lucide-react";
import { CONTACT, WA, WORK_WITH_US } from "./data";
import { Btn, Eyebrow, Reveal } from "./ui";

const waHref = (msg?: string) =>
  `https://wa.me/${WA}?text=` + encodeURIComponent(msg ?? "Hola, quisiera coordinar un traslado en Talara.");

function RequirementList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h3 className="font-display text-[15px] font-extrabold uppercase tracking-wide text-carbon">{title}</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-steel">
            <ArrowRight size={15} className="mt-0.5 shrink-0 text-sun-deep" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Página "Trabaja con nosotros": requisitos reales para postular. */
export function WorkWithUsPage() {
  return (
    <div className="pt-[68px]">
      <section className="bg-ink py-14 text-white lg:py-16">
        <div className="shell">
          <p className="label-mono flex items-center gap-3 text-sun">
            <span className="h-px w-8 bg-sun/50" />
            <Briefcase size={14} className="inline -mt-0.5" /> Trabaja con nosotros
          </p>
          <h1 className="h-hero mt-4 max-w-2xl text-[2.4rem]">Súmate a la flota</h1>
        </div>
      </section>

      <section className="bg-paper py-16 lg:py-20">
        <div className="shell">
          <Reveal>
            <Eyebrow>Requisitos</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <p className="max-w-2xl text-[15px] leading-relaxed text-steel">{WORK_WITH_US.note}</p>
          </Reveal>

          <div className="mt-10 grid gap-10 rounded-3xl border border-line bg-white p-7 shadow-card sm:grid-cols-2 lg:p-10">
            <Reveal>
              <RequirementList title="Propietario" items={WORK_WITH_US.propietario} />
            </Reveal>
            <Reveal delay={80}>
              <RequirementList title="Conductor" items={WORK_WITH_US.conductor} />
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn variant="wa" href={waHref("Hola, quiero postular como conductor/propietario. Adjunto mi CV.")}>
                <WhatsAppIcon size={18} /> Postular por WhatsApp
              </Btn>
              <Btn variant="outline" href={`mailto:${CONTACT.email}`}>
                <Mail size={18} /> Enviar CV por correo
              </Btn>
            </div>
          </Reveal>
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
