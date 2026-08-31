# Taxi Service Talara — sitio web

Sitio de presentación para **Taxi Service Talara** (Talara, Piura): traslados a
Cabo Blanco, Punta Sal y Punta Veleros, y servicio de van, camioneta o bus
turístico.

**Es un sitio 100% estático, sin panel de administración ni CMS.** Todo el
contenido (textos, teléfonos, destinos, servicios) vive en
[`src/data.ts`](src/data.ts); las fotos y videos van directo en
[`public/`](public/), organizados por carpeta. Para cambiar algo se edita el
código o se reemplazan los archivos y se vuelve a compilar y subir — no hay
login de dueño ni backend.

```
Vite + React + TS + Tailwind v4 → build estático → cPanel (public_html)
```

## Arranque rápido

```bash
npm install
npm run dev      # http://localhost:5173
```

| Comando              | Qué hace                             |
| --------------------- | ------------------------------------ |
| `npm run dev`          | Servidor de desarrollo               |
| `npm run build`        | Build de producción en `dist/`       |
| `npm run lint`         | oxlint                               |
| `npm run typecheck`    | Chequeo de tipos                     |
| `npm run audit`        | Auditoría de vulnerabilidades        |

## Cómo está organizado

| Archivo               | Qué contiene                                                  |
| ----------------------- | ---------------------------------------------------------------- |
| `src/index.css`          | Sistema de diseño: colores, tipografías, animaciones              |
| `src/data.ts`            | Contacto, navegación, destinos y servicios de transporte           |
| `src/ui.tsx`             | Botones, etiquetas, revelado al hacer scroll                       |
| `src/lib/Lightbox.tsx`   | Visor de fotos/video a pantalla completa de las galerías           |
| `src/hooks.ts`           | Observador de scroll y enrutador mínimo (`useRoute`)                |
| `src/App.tsx`            | Secciones de la home y composición                                   |
| `src/DestinationPage.tsx`| Página propia de cada destino (`/destinos/<id>`): galería completa, descripción y CTA |

El sitio tiene rutas propias por destino (`/destinos/cabo-blanco`, etc.) usando
`history.pushState`, sin librería de routing — no hace falta más para dos
vistas. El `.htaccess` ya sirve `index.html` en cualquier ruta, así que abrir
esas URLs directo (o recargar la página) también funciona.

### Fotos y videos

Cada destino o servicio tiene su propia carpeta en `public/`, y `src/data.ts`
(`DESTINATIONS` / `TRANSPORT_SERVICES`) apunta a esos archivos:

```
public/
  cabo-blanco/            4 fotos + 3 videos
  punta-sal/              4 fotos
  punta-veleros/          5 fotos
  servicio-van-turistica/     2 fotos
  alquiler-camionetas/        2 fotos
  servicio-turistico-de-bus/  1 foto
```

Para agregar o cambiar una foto: se reemplaza el archivo en su carpeta y, si
cambia el nombre, se actualiza la ruta en `src/data.ts`. Un servicio o destino
sin fotos (`media: []`) se ve igual de bien: la tarjeta muestra un ícono en
vez de galería.

## Pendientes antes de publicar

- [ ] **Revisar el texto de cada destino y servicio** en `src/data.ts` — es
      contenido de partida, conviene que el dueño lo confirme o ajuste.
- [ ] Confirmar enlaces de Facebook/Instagram en `src/data.ts` → `CONTACT`.

## Despliegue (cPanel)

```bash
npm run build
```

Se comprime el **contenido** de `dist/` (no la carpeta) y se sube a
`public_html` por File Manager. El `.htaccess` (HTTPS, cabeceras de
seguridad, caché, fallback SPA) va incluido — no hay que crearlo a mano.

> **AutoSSL antes que HSTS.** El `.htaccess` manda HSTS a 2 años; si se activa
> sin certificado válido, el sitio queda inaccesible sin vuelta atrás.

> Los videos de Cabo Blanco pesan ~1.5–2 MB cada uno. Si el hosting tiene
> límite de espacio o de transferencia ajustado, vale la pena comprimirlos
> antes de subir el sitio.
