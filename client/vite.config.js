import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/vscode-web': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
        // Don't strip the /vscode-web prefix — Express handles path routing
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@app': resolve(__dirname, 'src/app'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@features': resolve(__dirname, 'src/features'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@routes': resolve(__dirname, 'src/routes'),
      '@redux': resolve(__dirname, 'src/redux'),
      '@services': resolve(__dirname, 'src/services'),
      '@socket': resolve(__dirname, 'src/socket'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@context': resolve(__dirname, 'src/context'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@validations': resolve(__dirname, 'src/validations'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@themes': resolve(__dirname, 'src/themes'),
      '@config': resolve(__dirname, 'src/config'),
      '@data': resolve(__dirname, 'src/data'),
      '@helpers': resolve(__dirname, 'src/helpers'),
      '@types': resolve(__dirname, 'src/types'),
      '@guards': resolve(__dirname, 'src/guards'),
      '@providers': resolve(__dirname, 'src/providers'),
    },
  },
});
