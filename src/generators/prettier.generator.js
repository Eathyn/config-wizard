import { join } from 'path'
import { writeFileSync } from 'fs'
import { stringifyTemplate, generateConfigFileName } from '../utils/file.js'
import handleError from '../utils/error.js'

export default function generatePrettierConfig(answers) {
  try {
    const { fileName, fileContent } = getPrettierConfig(answers)
    const configPath = join(process.cwd(), fileName)
    writeFileSync(configPath, fileContent)
    console.log(`已生成 Prettier 配置文件：${fileName}`)
  } catch (err) {
    handleError('Prettier 配置文件生成失败', err)
  }
}

function getPrettierConfig({ moduleType, framework, useTypeScript }) {
  const prettierFileName = generateConfigFileName({ moduleType, useTypeScript, toolName: 'prettier' })
  if (framework === 'vue') {
    // Prettier 目前需要使用实验性的 node 标志才能将配置文件改为 ts 格式，等这个标志稳定后再改
    // https://prettier.io/docs/configuration#typescript-configuration-files
    return {
      fileName: prettierFileName,
      fileContent: stringifyTemplate('prettier', 'prettierJs.js'),
    }
  } else if (framework === 'react') {
    // TODO 先不做 React 的配置
  } else {
    throw new Error(`不支持该框架`)
  }
}
