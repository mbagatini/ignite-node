module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
		"standard-with-typescript",
		"plugin:prettier/recommended"
	],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/strict-boolean-expressions": "off",
    }
}
