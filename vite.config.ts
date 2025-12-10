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
      // Force all imports to resolve to the project's version of React
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
    },
  },
  // Prevent Vite from pre-bundling key dependencies that might cause conflicts
  optimizeDeps: {
    exclude: ['react', 'react-dom', 'framer-motion', 'zustand'],
  },
  // Define global for compatibility with certain libraries
  define: {
    global: 'globalThis',
  },
  server: {
    // Optional: configure server settings if needed
  },
  build: {
    // Optional: configure build settings if needed
  },
})