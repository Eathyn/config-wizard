import { join } from 'path'
import { writeFileSync } from 'fs'
import { stringifyTemplate, generateConfigFileName } from '../utils/file.js'
import handleError from '../utils/error.js'

export default function generateStylelintConfig(answers) {
  try {
    const { fileName, fileContent } = getStylelintConfig(answers)
    const configPath = join(process.cwd(), fileName)
    writeFileSync(configPath, fileContent)
    console.log(`已生成 Stylelint 配置文件：${fileName}`)
  } catch (err) {
    handleError('Stylelint 配置文件生成失败', err)
  }
}

export function getStylelintConfig({ moduleType, framework, useTypeScript }) {
  const stylelintFileName = generateConfigFileName({moduleType, useTypeScript, toolName: 'stylelint'})
  if (framework === 'vue') {
    return {
      fileName: stylelintFileName,
      // stylelint 还不支持 ts 文件：https://stylelint.io/user-guide/configure
      fileContent: stringifyTemplate('stylelint', 'stylelintVue.js'),
    }
  } else if (framework === 'react') {
    // TODO 先不做 React 的配置
  } else {
    throw new Error(`不支持该框架`)
  }
}
