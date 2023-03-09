module.exports = {
	env: {
		node: true,
		es2021: true,
	},
	extends: ['standard', 'plugin:prettier/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		'prettier/prettier': [
			'error',
			{
				printWidth: 80,
				useTabs: true,
				singleQuote: true,
				trailingComma: 'all',
				arrowParens: 'always',
				semi: false,
			},
		],
		'no-useless-constructor': 0,
		camelcase: 0,
	},
	settings: {
		'import/parsers': {
			[require.resolve('@typescript-eslint/parser')]: ['.ts', '.tsx', '.d.ts'],
		},
	},
}
