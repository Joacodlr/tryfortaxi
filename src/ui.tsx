import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from "react";
import { useRoute } from "./hooks";

/* ------------------------------------------------------------------ *
 *  Piezas de interfaz compartidas por el sitio.
 * ------------------------------------------------------------------ */

/** Hace aparecer su contenido cuando entra en pantalla. */
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
    <div data-reveal="" className={className} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`label-caps mb-3 flex items-center gap-2.5 ${light ? "text-white/85" : "text-road"}`}>
      <span className="road-line w-8" aria-hidden="true" />
      {children}
    </p>
  );
}

/** Enlace interno: navega sin recargar la página. */
export function Link({
  to,
  children,
  className = "",
  onClick,
  ...rest
}: { to: string; children: ReactNode; className?: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { path, navigate } = useRoute();
  return (
    <a
      {...rest}
      href={to}
      className={className}
      aria-current={to === path ? "page" : undefined}
      onClick={(e) => {
        onClick?.(e);
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

/* ------------------------------- botones ------------------------------ */

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] active:scale-[.98] px-6 py-3.5";

const BTN_VARIANT = {
  red: "bg-road text-white shadow-[0_12px_30px_-10px_rgba(212,32,47,.7)] hover:bg-road-deep hover:-translate-y-0.5",
  navy: "bg-navy text-white hover:bg-navy-2 hover:-translate-y-0.5",
  ghost: "text-white border border-white/30 bg-white/5 hover:bg-white/15 hover:border-white/60 hover:-translate-y-0.5",
  outline: "text-navy border border-line bg-white hover:border-navy/40 hover:-translate-y-0.5 hover:shadow-card",
  wa: "bg-wa text-white shadow-[0_12px_30px_-10px_rgba(37,211,102,.75)] hover:bg-wa-deep hover:-translate-y-0.5",
} as const;

export type BtnVariant = keyof typeof BTN_VARIANT;
export const btnClass = (variant: BtnVariant = "red", extra = "") => `${BTN_BASE} ${BTN_VARIANT[variant]} ${extra}`;

/** Enlace externo con aspecto de botón (WhatsApp, teléfono, correo). */
export function ExtBtn({
  href,
  variant = "red",
  className = "",
  children,
}: {
  href: string;
  variant?: BtnVariant;
  className?: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={btnClass(variant, className)}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

/** Ícono oficial de WhatsApp (lucide no lo trae). */
export function WaIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43m8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.79.72.7 5.81.7 12.07c0 2 .52 3.95 1.52 5.67L.6 23.62l6.02-1.58a11.3 11.3 0 0 0 5.42 1.38h.01c6.25 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.32-8.03" />
    </svg>
  );
}
