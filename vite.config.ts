import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * En desarrollo no existe la función de Vercel, así que se atiende
 * /api/reviews con el mismo código (api/reviews.ts), que sin las
 * variables de Upstash guarda en memoria.
 */
function devReviewsApi(): Plugin {
  return {
    name: "dev-reviews-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/reviews", async (req, res) => {
        const api = await server.ssrLoadModule("/api/reviews.ts");
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const request = new Request(`http://localhost${req.originalUrl ?? "/api/reviews"}`, {
          method: req.method,
          headers: req.headers as Record<string, string>,
          body: req.method === "POST" ? Buffer.concat(chunks) : undefined,
        });
        const handler = req.method === "POST" ? api.POST : api.GET;
        const response: Response = await handler(request);
        res.statusCode = response.status;
        response.headers.forEach((v, k) => res.setHeader(k, v));
        res.end(await response.text());
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
