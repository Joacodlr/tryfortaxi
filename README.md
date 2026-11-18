# Transportes Tomy D. — sitio web

Sitio estático (Vite + React + Tailwind) para reemplazar el WordPress de transportestomyd.com.

## Comandos

```
npm run dev        # desarrollo
npm run build      # genera dist/
npm run typecheck
```

## Publicar en cPanel

1. `npm run build`
2. Subir el **contenido** de `dist/` a `public_html` (incluye `.htaccess` y `api/reclamo.php`).
3. Antes, respaldar y retirar el WordPress actual de `public_html`.

## Editar contenido

Todo el texto editable (teléfono, correo, servicios, flota, redes) está en `src/data.ts`.
Lo que hay que confirmar con el cliente está marcado con `PENDIENTE`.

## Libro de Reclamaciones

`public/api/reclamo.php` guarda cada hoja en `../reclamaciones/` (fuera de `public_html`)
con un código correlativo y la envía por correo a la empresa y al consumidor.
En desarrollo (`npm run dev`) no hay PHP, así que el envío falla: probarlo en el hosting.
