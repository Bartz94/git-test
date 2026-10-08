import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this repo under /git-test/
export default defineConfig({
  plugins: [react()],
  base: '/git-test/',
});
