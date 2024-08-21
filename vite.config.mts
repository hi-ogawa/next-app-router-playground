import next from 'next/vite';
import { defineConfig } from 'vite';

export default defineConfig((env) => ({
  plugins: [
    next({
      // ssg is opt-in for now
      prerender: async (_, presets) => ['/', ...(await presets.generateStaticParams())],
    }),
  ],
  ssr: {
    // https://github.com/styled-components/styled-components/issues/4268
    // https://github.com/styled-components/styled-components/issues/4275
    noExternal: env.command === 'serve' ? ['styled-components'] : [],
  },
}));
