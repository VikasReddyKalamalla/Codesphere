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
    host: '0.0.0.0',
    port: 5173,
    headers: {
      'Cache-Control': 'no-store',
      // Allow Firebase Auth and external registration popups to communicate without COOP restrictions
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
    proxy: {
      '/collab': {
        target: 'http://localhost:4000',
        ws: true,
        changeOrigin: true,
      },
      '/api/ai': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/api/execute': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/api/proxy': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/api/git-proxy': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/workspace-proxy': {
        target: 'http://127.0.0.1:5001',
        ws: true,
        changeOrigin: true,
      },
      '/vscode-web': {
        target: 'http://127.0.0.1:5001',
        ws: true,
        changeOrigin: true,
      },
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
      '/preview': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      '@reduxjs/toolkit',
      'framer-motion',
      'lucide-react',
      'clsx',
      'axios',
      'react-hot-toast',
      'react-intersection-observer',
    ],
    exclude: ['y-monaco'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'monaco-editor/esm/vs/editor/editor.api.js': resolve(__dirname, 'src/features/codex/services/monacoShim.ts'),
      'monaco-editor/esm/vs/editor/editor.api': resolve(__dirname, 'src/features/codex/services/monacoShim.ts'),
      'monaco-editor': resolve(__dirname, 'src/features/codex/services/monacoShim.ts'),
      'react': resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
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
      '@providers': resolve(__dirname, 'src/providers'),
      '@pages': resolve(__dirname, 'src/pages'),
    },
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@monaco-editor') || id.includes('monaco-editor')) {
              return 'vendor-monaco';
            }
            if (id.includes('three') || id.includes('react-globe.gl')) {
              return 'vendor-three';
            }
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'vendor-icons';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            if (id.includes('react-pdf') || id.includes('pdfjs-dist')) {
              return 'vendor-pdf';
            }
            if (id.includes('react-syntax-highlighter') || id.includes('prismjs')) {
              return 'vendor-syntax';
            }
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
              return 'vendor-redux';
            }
          }
        },
      },
    },
  },
});
