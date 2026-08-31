import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

/* Fuentes auto-hospedadas (subconjunto latino).
   Se sirven desde nuestro propio dominio, así la CSP puede quedarse
   en `font-src 'self'` y no dependemos de Google Fonts. */
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/manrope/latin-800.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
