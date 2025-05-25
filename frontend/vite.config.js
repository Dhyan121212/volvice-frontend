import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // ✅ correct plugin for React

export default defineConfig({
  plugins: [react()], // ✅ no need to include Tailwind here
});
