import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { COMPANY, RECLAMO_URL, mailHref } from "./data";

/**
 * Libro de Reclamaciones virtual (Ley 29571 / D.S. 011-2011-PCM).
 * Envía la hoja a public/api/reclamo.php, que la manda por correo a la
 * empresa y una copia al consumidor, con un código correlativo.
 */
const EMPTY = {
  name: "",
  docType: "DNI",
  docNumber: "",
  address: "",
  phone: "",
  email: "",
  minor: false,
  guardian: "",
  goodType: "Servicio",
  amount: "",
  goodDescription: "",
  kind: "Reclamo",
  detail: "",
  request: "",
  accept: false,
  website: "", // trampa para bots: debe quedar vacío
};

export function ComplaintForm() {
  const [f, setF] = useState(EMPTY);
  const [state, setState] = useState<{ status: "idle" | "sending" | "done" | "error"; code?: string; error?: string }>({ status: "idle" });
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState({ status: "sending" });
    try {
      const res = await fetch(RECLAMO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = (await res.json().catch(() => ({}))) as { code?: string; error?: string };
      if (!res.ok || !data.code) throw new Error(data.error || "No se pudo enviar.");
      setState({ status: "done", code: data.code });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setState({ status: "error", error: err instanceof Error ? err.message : "No se pudo enviar." });
    }
  };

  if (state.status === "done") {
    return (
      <div className="rounded-3xl border border-line bg-white p-8 text-center shadow-card sm:p-12">
        <CheckCircle2 className="mx-auto size-16 text-wa" />
        <h2 className="mt-4 font-display text-2xl font-extrabold text-navy">Hoja de reclamación registrada</h2>
        <p className="mt-2 text-steel">
          Código: <strong className="text-ink">{state.code}</strong>
        </p>
        <p className="mx-auto mt-4 max-w-lg text-steel">
          Te enviamos una copia a <strong>{f.email}</strong>. Daremos respuesta en un plazo no mayor a 15 días hábiles.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink transition focus:border-navy focus:outline-none focus:ring-4 focus:ring-navy/10";

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="rounded-2xl bg-mist p-6 text-sm leading-relaxed text-steel">
        <p className="font-display text-base font-extrabold text-navy">{COMPANY.legalName}</p>
        {COMPANY.ruc && <p>RUC: {COMPANY.ruc}</p>}
        {COMPANY.address && <p>Dirección: {COMPANY.address}</p>}
        <p>Fecha: {new Date().toLocaleDateString("es-PE")}</p>
      </div>

      <Block n={1} title="Identificación del consumidor reclamante">
        <F label="Nombre completo *" span>
          <input required className={field} value={f.name} onChange={set("name")} autoComplete="name" />
        </F>
        <F label="Tipo de documento *">
          <select className={field} value={f.docType} onChange={set("docType")}>
            <option>DNI</option>
            <option>Carné de extranjería</option>
            <option>Pasaporte</option>
            <option>RUC</option>
          </select>
        </F>
        <F label="Número de documento *">
          <input required className={field} value={f.docNumber} onChange={set("docNumber")} />
        </F>
        <F label="Domicilio *" span>
          <input required className={field} value={f.address} onChange={set("address")} autoComplete="street-address" />
        </F>
        <F label="Teléfono *">
          <input required type="tel" className={field} value={f.phone} onChange={set("phone")} autoComplete="tel" />
        </F>
        <F label="Correo electrónico *">
          <input required type="email" className={field} value={f.email} onChange={set("email")} autoComplete="email" />
        </F>
        <label className="flex items-center gap-3 text-sm font-semibold text-ink sm:col-span-2">
          <input type="checkbox" className="size-4 accent-road" checked={f.minor} onChange={(e) => setF({ ...f, minor: e.target.checked })} />
          Soy menor de edad
        </label>
        {f.minor && (
          <F label="Nombre del padre, madre o apoderado *" span>
            <input required className={field} value={f.guardian} onChange={set("guardian")} />
          </F>
        )}
      </Block>

      <Block n={2} title="Identificación del bien contratado">
        <F label="Tipo *">
          <select className={field} value={f.goodType} onChange={set("goodType")}>
            <option>Servicio</option>
            <option>Producto</option>
          </select>
        </F>
        <F label="Monto reclamado (S/)">
          <input type="number" min={0} step="0.01" className={field} value={f.amount} onChange={set("amount")} />
        </F>
        <F label="Descripción *" span>
          <input required className={field} placeholder="Ej. Traslado al aeropuerto del 12/11" value={f.goodDescription} onChange={set("goodDescription")} />
        </F>
      </Block>

      <Block n={3} title="Detalle de la reclamación y pedido del consumidor">
        <div className="sm:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { v: "Reclamo", d: "Disconformidad relacionada con el producto o servicio." },
              { v: "Queja", d: "Malestar respecto a la atención al público." },
            ].map((o) => (
              <label
                key={o.v}
                className={`cursor-pointer rounded-xl border p-4 transition ${f.kind === o.v ? "border-navy bg-navy/5" : "border-line hover:border-navy/40"}`}
              >
                <span className="flex items-center gap-2 font-bold text-ink">
                  <input type="radio" name="kind" className="accent-road" checked={f.kind === o.v} onChange={() => setF({ ...f, kind: o.v })} />
                  {o.v}
                </span>
                <span className="mt-1 block text-sm text-steel">{o.d}</span>
              </label>
            ))}
          </div>
        </div>
        <F label="Detalle *" span>
          <textarea required rows={5} className={field} value={f.detail} onChange={set("detail")} />
        </F>
        <F label="Pedido *" span>
          <textarea required rows={3} className={field} value={f.request} onChange={set("request")} />
        </F>
      </Block>

      {/* Trampa anti-spam, invisible para personas */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" value={f.website} onChange={set("website")} aria-hidden="true" />

      <div className="space-y-4 text-sm leading-relaxed text-steel">
        <p>
          * La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer
          una denuncia ante el INDECOPI. El proveedor deberá dar respuesta al reclamo en un plazo no mayor a quince (15) días hábiles.
        </p>
        <label className="flex items-start gap-3 font-semibold text-ink">
          <input required type="checkbox" className="mt-1 size-4 accent-road" checked={f.accept} onChange={(e) => setF({ ...f, accept: e.target.checked })} />
          Declaro que los datos consignados son correctos y acepto que sean usados para atender mi reclamación.
        </label>
      </div>

      {state.status === "error" && (
        <p role="alert" className="rounded-xl bg-road-soft p-4 text-sm font-semibold text-road-deep">
          {state.error} Si el problema continúa, escríbenos a{" "}
          <a href={mailHref} className="underline">
            {COMPANY.email}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={state.status === "sending"}
        className="w-full rounded-full bg-road px-8 py-4 font-display font-bold text-white transition hover:bg-road-deep disabled:opacity-60 sm:w-auto"
      >
        {state.status === "sending" ? "Enviando…" : "Enviar hoja de reclamación"}
      </button>
    </form>
  );
}

function Block({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
      <legend className="float-left mb-6 flex w-full items-center gap-3 font-display text-lg font-extrabold text-navy">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-road text-sm text-white">{n}</span>
        {title}
      </legend>
      <div className="clear-both grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function F({ label, span = false, children }: { label: string; span?: boolean; children: ReactNode }) {
  return (
    <label className={`block ${span ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}
