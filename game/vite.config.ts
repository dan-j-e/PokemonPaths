import { defineConfig } from 'vite';

export default defineConfig({
  base: '/PokemonPaths/',
  server: {
    port: 5173,
    strictPort: true,
  },
});
