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
	plugins: ['@nx', 'import'],
	rules: {
		'@nx/enforce-module-boundaries': [
			'error',
			{
				allow: [],
				depConstraints: [
					{
						sourceTag: 'scope:web',
						onlyDependOnLibsWithTags: ['scope:shared', 'scope:web'],
					},
					{
						sourceTag: 'scope:crawler',
						onlyDependOnLibsWithTags: ['scope:shared', 'scope:crawler'],
					},
				],
			},
		],
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
