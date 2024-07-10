import next from 'next/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    next({
      // ssg is opt-in for now
      prerender: (_, presets) => presets.generateStaticParams(),
    }),
  ],
  ssr: {
    // https://github.com/styled-components/styled-components/issues/4268
    // https://github.com/styled-components/styled-components/issues/4275
    noExternal: ['styled-components'],
  },
});
