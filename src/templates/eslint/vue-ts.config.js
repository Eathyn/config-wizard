import globals from 'globals'
import jsEslint from '@eslint/js'
import tsEslint from 'typescript-eslint'
import vueEslint from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'

const jsEslintConfig = jsEslint.configs.recommended
const tsEslintConfig = tsEslint.configs.recommended

export default tsEslint.config(
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
      tsEslintConfig,
      vueEslint.configs['flat/recommended'],
    ],
  },

  {
    name: 'app/typescript-files',
    files: ['**/*.ts'],
    extends: [
      jsEslintConfig,
      tsEslintConfig,
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
)
