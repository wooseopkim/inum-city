/* eslint-env node */

/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', '@nx'],
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
	},
	root: true,
};
