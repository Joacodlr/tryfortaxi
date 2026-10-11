/* ------------------------------------------------------------------ *
 *  /api/reviews — opiniones de pasajeros
 *
 *  Función de Vercel (único código de servidor del sitio). Guarda las
 *  opiniones en Upstash Redis, que se conecta desde el panel de Vercel:
 *  Storage → Upstash for Redis → Connect. Eso crea solo las variables
 *  KV_REST_API_URL y KV_REST_API_TOKEN; no hay que copiar nada a mano.
 *
 *  Las opiniones se publican al instante. Para borrar una (spam, insulto)
 *  se elimina el elemento de la lista `reviews` desde el Data Browser de
 *  Upstash.
 *
 *  En `npm run dev` (sin esas variables) usa una lista en memoria para
 *  poder probar el formulario; ver vite.config.ts.
 * ------------------------------------------------------------------ */

export type Review = {
  id: string;
  name: string;
  rating: number;
  service: string;
  comment: string;
  date: string;
};

const KEY = "reviews";
/** Se guardan como mucho las 300 más recientes. */
const MAX_STORED = 300;
/** Cuántas devuelve el GET. */
const MAX_LISTED = 60;
/** Segundos mínimos entre dos envíos desde la misma IP. */
const RATE_LIMIT_SECONDS = 60;

const LIMITS = { name: 60, service: 60, comment: 600 } as const;

const REDIS_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

/* ----------------------------- almacenamiento ----------------------------- */

type Store = {
  list: () => Promise<Review[]>;
  add: (r: Review) => Promise<void>;
  /** true si la IP puede enviar ahora (y la marca); false si envió hace poco. */
  allow: (ip: string) => Promise<boolean>;
};

async function redis(commands: (string | number)[][]): Promise<unknown[]> {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  const out = (await res.json()) as { result?: unknown; error?: string }[];
  return out.map((o) => {
    if (o.error) throw new Error(o.error);
    return o.result;
  });
}

const redisStore: Store = {
  async list() {
    const [raw] = await redis([["LRANGE", KEY, 0, MAX_LISTED - 1]]);
    return (raw as string[]).flatMap((s) => {
      try {
        return [JSON.parse(s) as Review];
      } catch {
        return [];
      }
    });
  },
  async add(r) {
    await redis([
      ["LPUSH", KEY, JSON.stringify(r)],
      ["LTRIM", KEY, 0, MAX_STORED - 1],
    ]);
  },
  async allow(ip) {
    const [ok] = await redis([["SET", `reviews:rl:${ip}`, 1, "EX", RATE_LIMIT_SECONDS, "NX"]]);
    return ok === "OK";
  },
};

/** Solo para desarrollo local: se pierde al reiniciar el servidor. */
const memory: Review[] = [];
const memoryStore: Store = {
  list: async () => memory.slice(0, MAX_LISTED),
  add: async (r) => {
    memory.unshift(r);
  },
  allow: async () => true,
};

function getStore(): Store | null {
  if (REDIS_URL && REDIS_TOKEN) return redisStore;
  // En Vercel sin base conectada no fingimos que se guarda.
  if (process.env.VERCEL) return null;
  return memoryStore;
}

/* -------------------------------- handlers -------------------------------- */

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";

export async function GET(): Promise<Response> {
  const store = getStore();
  if (!store) return json({ error: "Las opiniones no están disponibles por ahora." }, 503);
  try {
    return json({ reviews: await store.list() });
  } catch {
    return json({ error: "No se pudieron cargar las opiniones." }, 502);
  }
}

export async function POST(request: Request): Promise<Response> {
  const store = getStore();
  if (!store) return json({ error: "Las opiniones no están disponibles por ahora." }, 503);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Datos inválidos." }, 400);
  }

  // Campo trampa: invisible para personas, los bots lo llenan.
  if (clean(body.website, 200)) return json({ ok: true }, 201);

  const name = clean(body.name, LIMITS.name);
  const service = clean(body.service, LIMITS.service);
  const comment = clean(body.comment, LIMITS.comment);
  const rating = Number(body.rating);

  if (name.length < 2) return json({ error: "Escribe tu nombre." }, 400);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return json({ error: "Elige una calificación de 1 a 5 estrellas." }, 400);
  if (comment.length < 5) return json({ error: "Cuéntanos un poco más sobre el servicio." }, 400);
  if (/https?:\/\/|www\./i.test(comment + name)) return json({ error: "Por favor no incluyas enlaces." }, 400);

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";

  try {
    if (!(await store.allow(ip)))
      return json({ error: "Ya recibimos tu opinión. Espera un minuto para enviar otra." }, 429);
    const review: Review = {
      id: crypto.randomUUID(),
      name,
      rating,
      service,
      comment,
      date: new Date().toISOString(),
    };
    await store.add(review);
    return json({ review }, 201);
  } catch {
    return json({ error: "No se pudo guardar tu opinión. Intenta de nuevo." }, 502);
  }
}
