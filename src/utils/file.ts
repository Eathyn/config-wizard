import path from 'path'
import fs from 'fs'

export function stringifyTemplate(dir: string, fileName: string) {
  const templatePath = path.join('..', 'templates', dir, fileName)
  return fs.readFileSync(templatePath, { encoding: 'utf-8' })
}

export function generateConfigFileName(moduleType: ModuleType, useTypeScript: boolean, toolName: ToolName ) {
  if (moduleType === 'esm') {
    if (useTypeScript) {
      switch (toolName) {
        case 'eslint':
          return 'eslint.config.ts'
        case 'prettier':
          // Prettier 目前需要使用实验性的 node 标志才能将配置文件改为 ts 格式，等这个标志稳定后再改
          // https://prettier.io/docs/configuration#typescript-configuration-files
          return 'prettier.config.js'
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
