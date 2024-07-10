import next from 'next/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [next()],
  ssr: {
    // https://github.com/styled-components/styled-components/issues/4268
    // https://github.com/styled-components/styled-components/issues/4275
    noExternal: ["styled-components"]
  }
});
