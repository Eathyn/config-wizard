import { join } from 'path'
import { writeFileSync } from 'fs'
import { stringifyTemplate, generateConfigFileName } from '../utils/file.ts'
import handleError from '../utils/error.ts'

export default function generateEslintConfig(answers: Answers) {
  try {
    const { fileName, fileContent } = getEslintConfig(answers)
    const configPath = join(process.cwd(), fileName)
    writeFileSync(configPath, fileContent)
    console.log(`已生成 ESLint 配置文件：${fileName}`)
  } catch (err) {
    handleError('ESLint 配置文件生成失败', err)
  }
}

function getEslintConfig(answers: Answers) {
  const { moduleType, framework, useTypeScript } = answers
  const eslintFileName = generateConfigFileName(moduleType, useTypeScript, 'eslint')
  if (framework === 'vue') {
    if (useTypeScript) {
      return {
        fileName: eslintFileName,
        fileContent: stringifyTemplate('eslint', 'vue-ts.config.js'),
      }
    } else {
      return {
        fileName: eslintFileName,
        fileContent: stringifyTemplate('eslint', 'vue-js.config.js'),
      }
    }
  } else {
    // TODO 先不做 React 的配置
    if (useTypeScript) {
      return {
        fileName: eslintFileName,
        fileContent: stringifyTemplate('eslint', 'react-ts.config.js'),
      }
    } else {
      return {
        fileName: eslintFileName,
        fileContent: stringifyTemplate('eslint', 'react-js.config.js'),
      }
    }
  }
}
