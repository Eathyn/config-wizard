import { join } from 'path'
import { writeFileSync } from 'fs'
import { stringifyTemplate, generateConfigFileName } from '../utils/file.ts'
import handleError from '../utils/error.ts'

export default function generateStylelintConfig(answers: Answers) {
  try {
    const { fileName, fileContent } = getStylelintConfig(answers)
    const configPath = join(process.cwd(), fileName)
    writeFileSync(configPath, fileContent)
    console.log(`已生成 Stylelint 配置文件：${fileName}`)
  } catch (err) {
    handleError('Stylelint 配置文件生成失败', err)
  }
}

export function getStylelintConfig(answers: Answers) {
  const { moduleType, framework, useTypeScript } = answers
  const stylelintFileName = generateConfigFileName(moduleType, useTypeScript, 'stylelint')
  if (framework === 'vue') {
    return {
      fileName: stylelintFileName,
      // stylelint 还不支持 ts 文件：https://stylelint.io/user-guide/configure
      fileContent: stringifyTemplate('stylelint', 'vue-js.config.js'),
    }
  } else {
    // TODO 先不做 React 的配置
    return {
      fileName: stylelintFileName,
      fileContent: stringifyTemplate('stylelint', 'react-js.config.js'),
    }
  }
}
