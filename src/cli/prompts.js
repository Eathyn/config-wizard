import { confirm, select } from '@inquirer/prompts'

export async function promptUser() {
  try {
    const needCodeLint = await confirm({
      message: '是否需要代码规范？',
      default: true,
    })
    const needCommitLint = await confirm({
      message: '是否需要提交规范？',
      default: true,
    })
    if (!needCodeLint && !needCommitLint) {
      console.log('所有选项都选择了否，结束执行。')
      process.exit(0)
    }
    const moduleType = await select({
      message: '使用哪种模块规范？',
      choices: [
        {
          name: 'ESM',
          value: 'esm',
        },
        {
          name: 'CommonJS',
          value: 'cjs',
        },
      ],
    })
    const useTypeScript = await confirm({
      message: '是否使用 TypeScript？',
      default: true,
    })
    const framework = await select({
      message: '使用哪个框架？',
      choices: [
        {
          name: 'Vue',
          value: 'vue',
        },
        {
          name: 'React',
          value: 'react',
        },
      ],
    })
    const packageManager = await select({
      message: '使用哪个包管理器？',
      choices: [
        {
          name: 'pnpm',
          value: 'pnpm',
        },
        {
          name: 'npm',
          value: 'npm',
        },
        {
          name: 'yarn',
          value: 'yarn',
        },
      ]
    })
    return {
      needCodeLint,
      needCommitLint,
      moduleType,
      useTypeScript,
      framework,
      packageManager,
    }
  } catch (err) {

  }
}
