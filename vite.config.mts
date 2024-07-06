import next from 'next/vite';
import { defineConfig } from 'vite';

export default defineConfig((env) => ({
  plugins: [
    next({
      // ssg is opt-in for now
      prerender: (_, presets) => presets.generateStaticParams(),
      plugins: [
        {
          name: 'config',
          apply: 'serve',
          config() {
            return {
              ssr: {
                optimizeDeps: {
                  include: [
                    '@heroicons/react/24/outline',
                    '@heroicons/react/24/solid',
                  ],
                },
                external: ['date-fns', 'dinero.js'],
              },
            };
          },
        },
      ],
    }),
  ],
  ssr: {
    // https://github.com/styled-components/styled-components/issues/4268
    // https://github.com/styled-components/styled-components/issues/4275
    noExternal: env.command === 'serve' ? ['styled-components'] : [],
  },
}));
