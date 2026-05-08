import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from /ai-math-knowledge-graph/ — all asset URLs
  // must be prefixed with this sub-path, otherwise CSS/JS 404 in production.
  base: '/ai-math-knowledge-graph/',
});
