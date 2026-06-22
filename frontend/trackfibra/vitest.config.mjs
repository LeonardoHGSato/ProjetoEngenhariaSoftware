import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Configuração base de testes do frontend.
// - jsdom: simula o DOM para testar componentes React.
// - setupFiles: registra os matchers de @testing-library/jest-dom.
// - alias "@": espelha o import absoluto usado na aplicação (aponta para src).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.js"],
    // CSS Modules não afetam as asserções; desligar acelera os testes.
    css: false,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
