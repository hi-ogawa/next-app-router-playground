import next from "next/vite";
import { defineConfig, Plugin } from "vite";

export default defineConfig({
  plugins: [
    next(),
    fixStyledJsx(),
  ],
});

/** @todo */
function fixStyledJsx(): Plugin {
  return {
    name: fixStyledJsx.name,
    resolveId(source, _importer, _options) {
      if (source === "styled-jsx") {
        return "\0virtual:styled-jsx"
      }
    },
    load(id, _options) {
      if (id === "\0virtual:styled-jsx") {
        return `
          export const StyleRegistry = null;
          export const createStyleRegistry = null;
        `;
      }
    },
  }
}
