import { sveltekit } from '@sveltejs/kit/vite';
import postcssPresetEnv from 'postcss-preset-env';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		postcss: {
			plugins: [postcssPresetEnv()],
		},
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
});
