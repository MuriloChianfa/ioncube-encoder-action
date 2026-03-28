import github from 'eslint-plugin-github'
import jest from 'eslint-plugin-jest'
import babelParser from '@babel/eslint-parser'
import globals from 'globals'

export default [
  github.getFlatConfigs().recommended,
  {
    ...jest.configs['flat/recommended'],
    files: ['**/__tests__/**/*.js']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['jest']
        }
      },
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.jest,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
      }
    },
    rules: {
      camelcase: 'off',
      'eslint-comments/no-use': 'off',
      'eslint-comments/no-unused-disable': 'off',
      'i18n-text/no-en': 'off',
      'import/no-commonjs': 'off',
      'import/no-namespace': 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      'prettier/prettier': 'error',
      semi: 'off'
    }
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '**/*.json',
      'eslint.config.mjs'
    ]
  }
]
