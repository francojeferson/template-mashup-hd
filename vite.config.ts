import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    // O código importa ícones como `import { ReactComponent as X } from "...svg"`,
    // convenção do CRA. O svgr reproduz isso para não reescrever 13 imports.
    svgr({ include: "**/*.svg" }),
  ],

  // O CRA expunha variáveis com o prefixo REACT_APP_. Mantido para que os
  // `.env` existentes e o pipeline continuem valendo sem edição.
  envPrefix: ["VITE_", "REACT_APP_"],

  build: {
    // NÃO é o `dist/` padrão do Vite de propósito: o Dockerfile copia
    // `/usr/src/app/build/` para o nginx, e o k8s depende disso.
    outDir: "build",
    sourcemap: false,
  },

  server: {
    port: 3000,
  },
});
