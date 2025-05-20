import { join } from 'path'
import { writeFileSync } from 'fs'
import { stringifyTemplate, generateConfigFileName } from '../utils/file.js'
import handleError from '../utils/error.js'

export default function generateEslintConfig(answers) {
  try {
    const { fileName, fileContent } = getEslintConfig(answers)
    const configPath = join(process.cwd(), fileName)
    writeFileSync(configPath, fileContent)
    console.log(`已生成 ESLint 配置文件：${fileName}`)
  } catch (err) {
    handleError('ESLint 配置文件生成失败', err)
  }
}

function getEslintConfig({ moduleType, framework, useTypeScript }) {
  const eslintFileName = generateConfigFileName({ moduleType, useTypeScript, toolName: 'eslint' })
  if (framework === 'vue') {
    if (useTypeScript) {
      return {
        fileName: eslintFileName,
        fileContent: stringifyTemplate('eslint', 'eslintVueTs.js'),
      }
    } else {
      return {
        fileName: eslintFileName,
        fileContent: stringifyTemplate('eslint', 'eslintVueJs.js'),
      }
    }
  } else if (framework === 'react') {
    // TODO 先不做 React 的配置
  } else {
    throw new Error(`不支持该框架`)
  }
}
