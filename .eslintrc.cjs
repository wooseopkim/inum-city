/* eslint-env node */

/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/typescript',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['import'],
	rules: {
		'import/order': 'error',
	},
	settings: {
		typescript: true,
		node: true,
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts'],
		},
	},
	root: true,
};
