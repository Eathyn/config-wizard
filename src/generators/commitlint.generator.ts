import { join } from 'path'
import { writeFileSync } from 'fs'
import { stringifyTemplate, generateConfigFileName } from '../utils/file.ts'
import handleError from '../utils/error.ts'

export default function generateCommitlintConfig(answers: Answers) {
  try {
    const { fileName, fileContent } = getCommitlintConfig(answers)
    const configPath = join(process.cwd(), fileName)
    writeFileSync(configPath, fileContent)
    console.log(`已生成 commitlint 配置文件：${fileName}`)
  } catch (err) {
    handleError('commitlint 配置文件生成失败', err)
  }
}

function getCommitlintConfig(answers: Answers) {
  const { moduleType, framework, useTypeScript } = answers
  const commitlintFileName = generateConfigFileName(moduleType, useTypeScript, 'commitlint')
  if (framework === 'vue') {
    if (useTypeScript) {
      return {
        fileName: commitlintFileName,
        fileContent: stringifyTemplate('commitlint', 'ts.config.ts'),
      }
    } else {
      return {
        fileName: commitlintFileName,
        fileContent: stringifyTemplate('commitlint', 'js.config.js'),
      }
    }
  } else {
    // TODO 先不做 React 的配置
    if (useTypeScript) {
      return {
        fileName: commitlintFileName,
        fileContent: stringifyTemplate('commitlint', 'ts.config.ts'),
      }
    } else {
      return {
        fileName: commitlintFileName,
        fileContent: stringifyTemplate('commitlint', 'js.config.js'),
      }
    }
  }
}
