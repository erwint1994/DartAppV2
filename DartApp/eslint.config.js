// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      angular.configs.tsAll,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-inferrable-types': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'eqeqeq': ['error', 'always'],
      'curly': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      angular.configs.templateAll,
    ],
    rules: {
      '@angular-eslint/template/i18n': 'off',
      '@angular-eslint/template/no-call-expression': 'off',
    },
  },
]);
