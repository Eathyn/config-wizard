import { join } from 'path'
import { writeFileSync } from 'fs'
import { stringifyTemplate, generateConfigFileName } from '../utils/file.js'
import handleError from '../utils/error.js'

export default function generateCommitlintConfig(answers) {
  try {
    const { fileName, fileContent } = getCommitlintConfig(answers)
    const configPath = join(process.cwd(), fileName)
    writeFileSync(configPath, fileContent)
    console.log(`已生成 commitlint 配置文件：${fileName}`)
  } catch (err) {
    handleError('commitlint 配置文件生成失败', err)
  }
}

function getCommitlintConfig({ moduleType, framework, useTypeScript }) {
  const commitlintFileName = generateConfigFileName({ moduleType, useTypeScript, toolName: 'commitlint' })
  if (framework === 'vue') {
    if (useTypeScript) {
      return {
        fileName: commitlintFileName,
        fileContent: stringifyTemplate('commitlint', 'commitlintTs.ts'),
      }
    } else {
      return {
        fileName: commitlintFileName,
        fileContent: stringifyTemplate('commitlint', 'commitlintJs.js'),
      }
    }
  } else if (framework === 'react') {
    // TODO 先不做 React 的配置
  } else {
    throw new Error(`不支持该框架`)
  }
}
