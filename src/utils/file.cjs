const path = require('path')
const fs = require('fs')
const appRoot = require('app-root-path')

function stringifyTemplate(dir, fileName) {
  const templatePath = path.join(appRoot.path, 'src', 'templates', dir, fileName)
  return fs.readFileSync(templatePath, { encoding: 'utf-8' })
}

function generateConfigFileName({ moduleType, useTypeScript, toolName }) {
  if (moduleType === 'esm') {
    if (useTypeScript) {
      switch (toolName) {
        case 'eslint':
          return 'eslint.config.ts'
        case 'prettier':
          return 'prettier.config.ts'
        case 'stylelint':
          // stylelint 还不支持 ts 文件：https://stylelint.io/user-guide/configure
          return 'stylelint.config.js'
        case 'commitlint':
          return 'commitlint.config.ts'
        default:
          throw new Error('Unsupported tool name')
      }
    } else {
      switch (toolName) {
        case 'eslint':
          return 'eslint.config.js'
        case 'prettier':
          return 'prettier.config.js'
        case 'stylelint':
          return 'stylelint.config.js'
        case 'commitlint':
          return 'commitlint.config.js'
        default:
          throw new Error('Unsupported tool name')
      }
    }
  } else {
    if (useTypeScript) {
      switch (toolName) {
        case 'eslint':
          return 'eslint.config.mts'
        case 'prettier':
          return 'prettier.config.mts'
        case 'stylelint':
          // stylelint 还不支持 ts 文件：https://stylelint.io/user-guide/configure
          return 'stylelint.config.mjs'
        case 'commitlint':
          return 'commitlint.config.mts'
        default:
          throw new Error('Unsupported tool name')
      }
    } else {
      switch (toolName) {
        case 'eslint':
          return 'eslint.config.mjs'
        case 'prettier':
          return 'prettier.config.mjs'
        case 'stylelint':
          return 'stylelint.config.mjs'
        case 'commitlint':
          return 'commitlint.config.mjs'
        default:
          throw new Error('Unsupported tool name')
      }
    }
  }
}

module.exports = {
  stringifyTemplate,
  generateConfigFileName,
}
