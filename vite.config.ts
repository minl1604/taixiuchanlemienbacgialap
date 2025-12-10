import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { cloudflare } from '@cloudflare/vite-plugin'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cloudflare({
      // Configuration for the Cloudflare plugin
    }),
  ],
  // Enforce a single instance of React to prevent invalid hook call errors
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Force all imports to resolve to the project's version of React and related libraries
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
      'react-dom/client': path.resolve(__dirname, 'node_modules/react-dom/client'),
      'framer-motion': path.resolve(__dirname, 'node_modules/framer-motion'),
      'zustand': path.resolve(__dirname, 'node_modules/zustand'),
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
    },
    dedupe: ['react', 'react-dom', 'framer-motion', 'zustand', 'react-router-dom', 'sonner', 'react-use', 'lucide-react'],
  },
  // Prevent Vite from pre-bundling key dependencies that might cause conflicts
  optimizeDeps: {
    force: true,
    exclude: ['react', 'react-dom', 'framer-motion', 'zustand', 'react-router-dom', 'sonner', 'react-use'],
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
  },
  // Define global for compatibility with certain libraries
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      },
    },
  },
})