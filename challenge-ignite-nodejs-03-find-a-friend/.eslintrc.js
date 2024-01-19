module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: [
		"standard-with-typescript", 'plugin:prettier/recommended'
	],
	plugins: [
		"prettier"
	],
    overrides: [
    ],
    parserOptions: {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    rules: {
		'prettier/prettier': [
			'error',
			{
				printWidth: 80,
				tabWidth: 4,
				singleQuote: true,
				trailingComma: 'all',
				arrowParens: 'always',
				semi: false,
			},
		],
		"@typescript-eslint/no-floating-promises": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
    }
}
