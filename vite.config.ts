import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

type Review = { id: string; name: string; rating: number; service: string; comment: string; date: string };

/**
 * En desarrollo no hay PHP: /api/reviews.php se atiende acá con una
 * lista en memoria (se pierde al reiniciar), para poder probar la
 * sección de opiniones. En el hosting responde public/api/reviews.php.
 */
function devReviewsApi(): Plugin {
  const reviews: Review[] = [];
  return {
    name: "dev-reviews-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/reviews.php", async (req, res) => {
        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(body));
        };
        if (req.method !== "POST") return send(200, { reviews: reviews.slice(0, 60) });

        let raw = "";
        for await (const c of req) raw += c;
        const b = JSON.parse(raw || "{}") as Record<string, unknown>;
        const str = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
        const name = str(b.name, 60);
        const comment = str(b.comment, 600);
        const rating = b.rating;
        if (name.length < 2) return send(400, { error: "Escribe tu nombre." });
        if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5)
          return send(400, { error: "Elige una calificación de 1 a 5 estrellas." });
        if (comment.length < 5) return send(400, { error: "Cuéntanos un poco más sobre el servicio." });

        const review: Review = {
          id: Math.random().toString(16).slice(2),
          name,
          rating,
          service: str(b.service, 60),
          comment,
          date: new Date().toISOString(),
        };
        reviews.unshift(review);
        send(201, { review });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devReviewsApi()],
  build: {
    // Sin sourcemaps en producción: no publicamos el código original.
    sourcemap: false,
  },
});
