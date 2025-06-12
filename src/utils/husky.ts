import { execSync } from 'child_process'
import { join } from 'path'
import { writeFileSync } from 'fs'
import handleError from './error.ts'

export function generateGitHooks(answers: Answers) {
  const { packageManager, needCodeLint, needCommitLint } = answers
  initHusky(packageManager)
  createPreCommitHook(needCodeLint)
  createCommitMessageHook(needCommitLint)
}

function initHusky(packageManager: PackageManager) {
  try {
    const huskyPrepareCmd = {
      npm: 'npm run prepare',
      pnpm: 'pnpm run prepare',
      yarn: 'yarn run postinstall',
    }[packageManager]
    execSync(huskyPrepareCmd, { stdio: 'inherit' })
    console.log('成功初始化 Husky')
  } catch (err) {
    handleError('初始化 Husky 失败', err)
  }
}

function createPreCommitHook(needCodeLint: boolean) {
  if (needCodeLint) {
    const preCommitPath = join(process.cwd(), '.husky', 'pre-commit')
    const preCommitContent = `#!/usr/bin/env bash\npnpm run lint\n`
    try {
      writeFileSync(preCommitPath, preCommitContent)
      console.log('成功创建 pre-commit 钩子')
    } catch (err) {
      handleError('创建 pre-commit 钩子失败', err)
    }
  }
}

function createCommitMessageHook(needCommitLint: boolean) {
  if (needCommitLint) {
    const commitMsgPath = join(process.cwd(), '.husky', 'commit-msg')
    const commitMsgContent = `#!/usr/bin/env bash\npnpm commitlint --edit "$1"\n`
    try {
      writeFileSync(commitMsgPath, commitMsgContent)
      console.log('成功创建 commit-msg 钩子')
    } catch (err) {
      handleError('创建 commit-msg 钩子失败', err)
    }
  }
}
