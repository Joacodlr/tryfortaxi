import { createContext, useContext, useEffect, useState } from "react";

/**
 * Enrutador mínimo con `history.pushState`, sin librerías.
 * El fallback SPA de `.htaccess` sirve index.html en cualquier ruta,
 * así que /servicios o /flota funcionan también con carga directa.
 */
export function useRouteState() {
  const [path, setPath] = useState(() => normalize(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(normalize(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to: string) => {
    const [p, hash] = to.split("#");
    const target = normalize(p || path);
    if (target !== path || !hash) window.history.pushState({}, "", to);
    setPath(target);
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  };

  return { path, navigate };
}

const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";

export const RouteContext = createContext<{ path: string; navigate: (to: string) => void }>({
  path: "/",
  navigate: () => {},
});
export const useRoute = () => useContext(RouteContext);

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
