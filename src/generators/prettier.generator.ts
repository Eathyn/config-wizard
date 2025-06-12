import { join } from 'path'
import { writeFileSync } from 'fs'
import { stringifyTemplate, generateConfigFileName } from '../utils/file.ts'
import handleError from '../utils/error.ts'

export default function generatePrettierConfig(answers: Answers) {
  try {
    const { fileName, fileContent } = getPrettierConfig(answers)
    const configPath = join(process.cwd(), fileName)
    writeFileSync(configPath, fileContent)
    console.log(`已生成 Prettier 配置文件：${fileName}`)
  } catch (err) {
    handleError('Prettier 配置文件生成失败', err)
  }
}

function getPrettierConfig(answers: Answers) {
  const { moduleType, framework, useTypeScript } = answers
  const prettierFileName = generateConfigFileName(moduleType, useTypeScript, 'prettier')
  if (framework === 'vue') {
    // Prettier 目前需要使用实验性的 node 标志才能将配置文件改为 ts 格式，等这个标志稳定后再改
    // https://prettier.io/docs/configuration#typescript-configuration-files
    return {
      fileName: prettierFileName,
      fileContent: stringifyTemplate('prettier', 'js.config.js'),
    }
  } else {
    // TODO 先不做 React 的配置
    return {
      fileName: prettierFileName,
      fileContent: stringifyTemplate('prettier', 'js.config.js'),
    }
  }
}
