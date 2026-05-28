import { defineConfig, globalIgnores } from "eslint/com.engenhariasoftware.trackfibrabackend.config";
import nextVitals from "eslint-com.engenhariasoftware.trackfibrabackend.config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-com.engenhariasoftware.trackfibrabackend.config-next.
  globalIgnores([
    // Default ignores of eslint-com.engenhariasoftware.trackfibrabackend.config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
