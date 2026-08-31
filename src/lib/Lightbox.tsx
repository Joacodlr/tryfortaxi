import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Media } from "../data";

/** Visor a pantalla completa para la galería de un destino o servicio. */
export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: Media[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const item = items[index];

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % items.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [index, items.length, onClose, onIndex]);

  if (!item) return null;

  return (
    <div
      className="anim-fade fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X size={20} />
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index - 1 + items.length) % items.length);
            }}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index + 1) % items.length);
            }}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div className="anim-pop max-h-[85vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
        {item.type === "video" ? (
          <video
            src={item.src}
            controls
            autoPlay
            playsInline
            className="max-h-[85vh] w-full rounded-2xl bg-black"
          />
        ) : (
          <img
            src={item.src}
            alt=""
            className="max-h-[85vh] w-full rounded-2xl object-contain"
          />
        )}
      </div>

      {items.length > 1 && (
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-display text-[12.5px] font-semibold text-white/70">
          {index + 1} / {items.length}
        </p>
      )}
    </div>
  );
}
