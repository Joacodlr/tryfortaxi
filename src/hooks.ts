import { useEffect, useState } from "react";

/**
 * Enrutador mínimo basado en `history.pushState`, sin librerías: el sitio
 * tiene dos formas de vista (home y página de destino), no hace falta más.
 * El fallback SPA de `.htaccess` ya sirve `index.html` en cualquier ruta,
 * así que una URL como /destinos/cabo-blanco funciona con carga directa.
 */
export function useRoute() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo(0, 0);
  };

  return { path, navigate };
}

/** ¿El visitante pidió menos movimiento en su sistema operativo? */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Activa el revelado al hacer scroll de todo `[data-reveal=""]` del documento. */
export function useRevealOnScroll() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-reveal", "in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );

    let queued = 0;
    const scan = () => {
      queued = 0;
      for (const el of document.querySelectorAll('[data-reveal=""]')) io.observe(el);
    };
    const schedule = () => {
      if (!queued) queued = requestAnimationFrame(scan);
    };

    scan();
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      if (queued) cancelAnimationFrame(queued);
    };
  }, []);
}
