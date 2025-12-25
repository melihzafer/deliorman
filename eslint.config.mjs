import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import globals from 'globals'
import babelParser from '@babel/eslint-parser'
import tsParser from '@typescript-eslint/parser'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Ignore build/output folders
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**'],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // Node-ish files
  {
    files: ['next.config.js', '**/*.config.{js,cjs,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 'latest',
        sourceType: 'script',
      },
    },
  },

  // JS/JSX
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 'latest',
        sourceType: 'module',
        babelOptions: {
          parserOpts: {
            plugins: ['jsx'],
          },
        },
      },
    },
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      // Next.js recommended rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // In this repo we rely on globals provided by Next.js runtime (window/document/process/console).
      // Disabling no-undef avoids noisy false-positives across mixed server/client files.
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },

  // TS/TSX
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      // Next.js recommended rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // In this repo we rely on globals provided by Next.js runtime (window/document/process/console).
      // Disabling no-undef avoids noisy false-positives across mixed server/client files.
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
]
