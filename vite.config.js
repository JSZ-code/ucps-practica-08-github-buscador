import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages sirve los repositorios de proyecto en /NOMBRE_REPO/.
// El workflow calcula esta variable automáticamente; en local usamos '/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
});
