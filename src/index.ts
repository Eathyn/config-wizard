import { Command } from 'commander'
import { confirm } from '@inquirer/prompts'
import { promptUser } from './cli/prompts'
import { getDependencies, installDependencies, updatePackageJson } from './utils/package'
import generateEditorConfig from './generators/editorconfig.generator'
import generateEslintConfig from './generators/eslint.generator'
import generatePrettierConfig from './generators/prettier.generator'
import generateStylelintConfig from './generators/stylelint.generator'
import generateCommitlintConfig from './generators/commitlint.generator'
import { generateGitHooks } from './utils/husky'
import validateAnswers from './cli/validate'

const program = new Command()

program
  .name('config wizard')
  .version('1.0.0')
  .description('config wizard')
  .action(async () => {
    const answers = await promptUser()
    if (typeof answers === 'undefined') {
      return
    }
    const { isValid, errors } = validateAnswers(answers)
    if (!isValid) {
      console.error('你的输入存在错误：')
      console.error(errors.join('\n'))
      process.exit(1)
    }
    if (!answers.needCodeLint && !answers.needCommitLint) {
      console.log('你选择了无需代码规范和提交规范，因此程序结束')
      process.exit(0)
    }
    const { devDependencies, devDependenciesExactVersion } = getDependencies(answers)
    const isInstallDependencies = await confirm({
      message: '是否立刻安装这些依赖',
      default: true,
    })
    if (isInstallDependencies) {
      await installDependencies(answers.packageManager, devDependencies, devDependenciesExactVersion)
    }
    if (answers.needCodeLint) {
      // 生成编辑器配置文件
      generateEditorConfig()
      // 生成 ESLint 配置文件
      generateEslintConfig(answers)
      // 生成 Prettier 配置文件
      generatePrettierConfig(answers)
      // 生成 Stylelint 配置文件
      generateStylelintConfig(answers)
    }
    if (answers.needCommitLint) {
      // 生成配置文件
      generateCommitlintConfig(answers)
    }
    // 更新 package.json
    updatePackageJson(answers)
    // 生成 Git 钩子
    generateGitHooks(answers)
  })

program.parse(process.argv)
