import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'~assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
			components: fileURLToPath(new URL('./src/components', import.meta.url)),
			utils: fileURLToPath(new URL('./src/utils', import.meta.url)),
			store: fileURLToPath(new URL('./src/stores', import.meta.url)),
			data: fileURLToPath(new URL('./src/data', import.meta.url)),
			assets: fileURLToPath(new URL('./src/assets', import.meta.url))
		}
	},
	build: {
		outDir: 'build',
		sourcemap: false,
		chunkSizeWarningLimit: 4096
	},
	server: {
		port: 3000
	}
});
