import { join } from 'path'
import { writeFileSync } from 'fs'
import { stringifyTemplate } from '../utils/file.js'
import handleError from '../utils/error.js'

export default function generateEditorConfig() {
  try {
    const { fileName, fileContent } = getEditorConfig()
    const configPath = join(process.cwd(), fileName)
    writeFileSync(configPath, fileContent)
    console.log(`已生成 .editorconfig 配置文件：${fileName}`)
  } catch (err) {
    handleError('.editorconfig 配置文件生成失败', err)
  }
}

function getEditorConfig() {
  return {
    fileName: '.editorconfig',
    fileContent: stringifyTemplate('editor', '.editorconfig')
  }
}

