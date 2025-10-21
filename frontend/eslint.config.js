import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist', 'node_modules', '.turbo', 'coverage'],
  },
  js.configs.recommended,
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tsPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // React recommended rules
      ...react.configs.recommended.rules,
      // React hooks recommended rules
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': 'warn',
      // Minimal TypeScript rule example (avoid using configs that may use 'extends')
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]

