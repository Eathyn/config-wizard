import globals from 'globals'
import jsEslint from '@eslint/js'
import vueEslint from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

const jsEslintConfig = jsEslint.configs.recommended

export default defineConfig([
  {
    name: 'app/global-settings',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
    languageOptions: {
      globals: globals.browser,
    },
  },

  {
    name: 'app/vue-files',
    files: ['**/*.vue'],
    extends: [
      jsEslintConfig,
      vueEslint.configs['flat/recommended'],
    ],
  },

  {
    name: 'app/javascript-files',
    files: ['**/*.js'],
    extends: [
      jsEslintConfig,
    ],
  },

  eslintConfigPrettier,
])
