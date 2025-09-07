import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/flint-sdk/index.ts'),
			name: 'FlintSDK',
			fileName: 'flint-sdk',
			formats: ['es', 'umd'],
		},
		rollupOptions: {
			external: ['@supabase/supabase-js', 'lit', 'uuid'],
			output: {
				globals: {
					'@supabase/supabase-js': 'supabase',
					lit: 'lit',
					uuid: 'uuid',
				},
			},
		},
	},
	plugins: [
		dts({
			insertTypesEntry: true,
			tsconfigPath: './tsconfig.json',
		}),
	],
});
