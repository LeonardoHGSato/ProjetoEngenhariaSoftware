// Registra os matchers de @testing-library/jest-dom (ex: toBeInTheDocument)
// no expect do Vitest e limpa o DOM renderizado após cada teste.
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
