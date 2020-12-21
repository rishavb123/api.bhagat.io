module.exports = {
    'parser': '@babel/eslint-parser',
    'env': {
        'browser': true,
        'es2021': true,
    },
    'extends': [
        'google',
    ],
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module',
    },
    'rules': {
        'linebreak-style': ['error', 'windows'],
        'object-curly-spacing': ['error', 'always'],
        'indent': ['error', 4],
        'require-jsdoc': ['error', {
            'require': {
                'FunctionDeclaration': false,
                'MethodDefinition': false,
                'ClassDeclaration': false,
                'ArrowFunctionExpression': false,
                'FunctionExpression': false,
            },
        }],
        'new-cap': 'off',
        'max-len': ['error', {
            'code': 120,
            'tabWidth': 4,
            'comments': 80,
        }],
    },
};
