import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/flint-sdk/index.ts'),
			name: 'FlintSDK',
			fileName: 'flint-sdk',
			formats: ['iife'], // Using IIFE for better browser compatibility
		},
		rollupOptions: {
			// Remove external dependencies to bundle them
			external: [], // Empty array means bundle everything
			output: {
				globals: {
					// No need for globals since we're bundling everything
				},
			},
		},
	},
});
