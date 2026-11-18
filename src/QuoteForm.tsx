import { useState, type FormEvent } from "react";
import { SERVICES, waLink } from "./data";
import { WaIcon } from "./ui";

/**
 * Formulario de cotización: no envía nada a un servidor, arma el
 * mensaje y abre WhatsApp con todo ya escrito.
 */
export function QuoteForm({ compact = false, defaultService = "" }: { compact?: boolean; defaultService?: string }) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    service: defaultService || SERVICES[0].title,
    date: "",
    passengers: "",
    route: "",
    details: "",
  });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const lines = [
      "Hola Transportes Tomy D., quisiera una cotización:",
      "",
      `• Nombre: ${form.name}`,
      form.company && `• Empresa: ${form.company}`,
      `• Servicio: ${form.service}`,
      form.date && `• Fecha: ${form.date}`,
      form.passengers && `• Pasajeros: ${form.passengers}`,
      form.route && `• Recorrido: ${form.route}`,
      form.details && `• Detalles: ${form.details}`,
    ].filter(Boolean);
    window.open(waLink(lines.join("\n")), "_blank", "noopener");
  };

  const field =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-steel/70 transition focus:border-navy focus:outline-none focus:ring-4 focus:ring-navy/10";
  const label = "mb-1.5 block text-sm font-semibold text-ink";

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className={label} htmlFor="q-name">Nombre *</label>
        <input id="q-name" required className={field} placeholder="Tu nombre" value={form.name} onChange={set("name")} />
      </div>
      <div>
        <label className={label} htmlFor="q-company">Empresa (opcional)</label>
        <input id="q-company" className={field} placeholder="Nombre de tu empresa" value={form.company} onChange={set("company")} />
      </div>
      <div>
        <label className={label} htmlFor="q-service">Servicio *</label>
        <select id="q-service" className={field} value={form.service} onChange={set("service")}>
          {SERVICES.map((s) => (
            <option key={s.id}>{s.title}</option>
          ))}
          <option>Otro</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="q-date">Fecha</label>
          <input id="q-date" type="date" className={field} value={form.date} onChange={set("date")} />
        </div>
        <div>
          <label className={label} htmlFor="q-pax">Pasajeros</label>
          <input id="q-pax" type="number" min={1} inputMode="numeric" className={field} placeholder="Ej. 4" value={form.passengers} onChange={set("passengers")} />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor="q-route">Recorrido</label>
        <input id="q-route" className={field} placeholder="Ej. Miraflores → Aeropuerto" value={form.route} onChange={set("route")} />
      </div>
      {!compact && (
        <div className="sm:col-span-2">
          <label className={label} htmlFor="q-details">Cuéntanos más</label>
          <textarea id="q-details" rows={3} className={field} placeholder="Horarios, turnos, equipaje, lo que necesites…" value={form.details} onChange={set("details")} />
        </div>
      )}
      <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-steel">Te respondemos por WhatsApp en minutos.</p>
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-wa px-7 py-3.5 font-display font-bold text-white shadow-[0_12px_30px_-10px_rgba(37,211,102,.75)] transition hover:-translate-y-0.5 hover:bg-wa-deep">
          <WaIcon />
          Enviar por WhatsApp
        </button>
      </div>
    </form>
  );
}
