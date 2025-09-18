import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      // Ensure the SDK is properly bundled
      external: ['@supabase/supabase-js', 'lit', 'lit/decorators.js', 'uuid']
    },
    // Copy the built SDK to the correct location
    assetsDir: '',
    copyPublicDir: true
  },
  server: {
    port: 3000
  },
  // Resolve alias for the SDK
  resolve: {
    alias: {
      // This ensures imports from the SDK work correctly
      './flint-sdk': resolve(__dirname, 'dist/flint-sdk.js')
    }
  }
});
