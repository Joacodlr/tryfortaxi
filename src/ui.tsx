import type { CSSProperties, ReactNode } from "react";

/* ------------------------------------------------------------------ *
 *  Piezas de interfaz compartidas por el sitio.
 * ------------------------------------------------------------------ */

/** Envoltorio que hace aparecer su contenido cuando entra en pantalla. */
export function Reveal({
  delay = 0,
  className = "",
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-reveal=""
      className={className}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`label-mono mb-4 flex items-center gap-2.5 ${light ? "text-sun" : "text-ocean-deep"}`}>
      <span className={`h-px w-7 ${light ? "bg-sun/50" : "bg-ocean-deep/40"}`} />
      {children}
    </p>
  );
}

/* ------------------------------- botones ------------------------------ */

type BtnProps = {
  children: ReactNode;
  className?: string;
  variant?: "solid" | "ghost" | "wa" | "outline";
} & Record<string, unknown>;

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] active:scale-[.98]";

const BTN_VARIANT = {
  solid:
    "bg-sun text-ink px-7 py-3.5 shadow-[0_10px_30px_-8px_rgba(232,163,61,.55)] hover:brightness-105 hover:-translate-y-0.5",
  ghost:
    "px-7 py-3.5 text-white border border-white/25 bg-white/5 hover:bg-white/12 hover:border-white/45 hover:-translate-y-0.5",
  outline:
    "px-7 py-3.5 text-carbon border border-line bg-white hover:border-carbon/35 hover:-translate-y-0.5 hover:shadow-card",
  wa: "bg-wa px-6 py-3.5 text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,.7)] hover:brightness-110 hover:-translate-y-0.5",
} as const;

/** Botón o enlace con el mismo lenguaje visual. Usa `href` para renderizar `<a>`. */
export function Btn({ children, className = "", variant = "solid", ...rest }: BtnProps) {
  const cls = `${BTN_BASE} ${BTN_VARIANT[variant]} ${className}`;
  if (typeof rest.href === "string") {
    return (
      <a className={cls} target="_blank" rel="noreferrer" {...(rest as object)}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...(rest as object)}>
      {children}
    </button>
  );
}
