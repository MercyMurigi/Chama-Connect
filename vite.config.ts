import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  /**
   * Express API port for the dev/preview /api proxy.
   * Prefer API_PORT. If only PORT is set to 3000 (common confusion with Vite's port), default to 3001
   * so the proxy does not target Vite itself (which yields 404 for /api/copilotkit).
   */
  const apiProxyPort = env.API_PORT || (env.PORT && env.PORT !== '3000' ? env.PORT : '') || '3001';
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${apiProxyPort}`,
          changeOrigin: true,
        },
      },
    },
    preview: {
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${apiProxyPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
