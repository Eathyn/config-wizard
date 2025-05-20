import { Command } from 'commander'
import { confirm } from '@inquirer/prompts'
import { promptUser } from './cli/prompts.js'
import { getDependencies, installDependencies, updatePackageJson } from './utils/package.js'
import generateEditorConfig from './generators/editorconfig.generator.js'
import generateEslintConfig from './generators/eslint.generator.js'
import generatePrettierConfig from './generators/prettier.generator.js'
import generateStylelintConfig from './generators/stylelint.generator.js'
import generateCommitlintConfig from './generators/commitlint.generator.js'
import { generateGitHooks } from './utils/husky.js'

const program = new Command()

program
  .name('config wizard')
  .version('1.0.0')
  .description('config wizard')
  .action(async () => {
    const answers = await promptUser()
    if (!answers.needCodeLint && !answers.needCommitLint) {
      console.log('你选择了无需代码规范和提交规范，因此程序结束')
      process.exit(0)
    }
    const { devDependencies, devDependenciesExactVersion } = await getDependencies(answers)
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
