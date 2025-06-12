import { execSync } from 'child_process'
import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import handleError from './error.ts'

type Dependencies = string[]
type PackageJson = Record<string, any>

export function getDependencies(answers: Answers) {
  const devDependencies: Dependencies = []
  const devDependenciesExactVersion: Dependencies = []
  addCodeLintDependencies(answers, devDependencies, devDependenciesExactVersion)
  addCommitLintDependencies(answers, devDependencies)
  logDependencies(devDependencies, devDependenciesExactVersion)
  return {
    devDependencies,
    devDependenciesExactVersion,
  }
}

function addCodeLintDependencies(answers: Answers, devDependencies: Dependencies, devDependenciesExactVersion: Dependencies) {
  const { needCodeLint, framework, useTypeScript } = answers
  if (!needCodeLint) return
  devDependencies.push(
    'eslint',
    '@eslint/js',
    'globals',
    'eslint-config-prettier',
    'husky',
    'lint-staged',
    'stylelint',
    'stylelint-config-hudochenkov',
    'stylelint-config-standard-vue',
    'stylelint-order',
  )
  devDependenciesExactVersion.push('prettier')
  switch (framework) {
    case 'vue':
      devDependencies.push('eslint-plugin-vue')
      break;
    case 'react':
      devDependencies.push('eslint-plugin-react', 'eslint-plugin-react-hooks')
      break;
  }
  if (useTypeScript) {
    devDependencies.push('typescript-eslint')
    devDependencies.push('jiti')
  }
}

function addCommitLintDependencies(answers: Answers, devDependencies: Dependencies) {
  const { needCommitLint, needCodeLint } = answers
  if (needCommitLint) {
    devDependencies.push(
      '@commitlint/cli',
      '@commitlint/config-conventional',
      '@commitlint/cz-commitlint',
      'commitizen',
      '@commitlint/types',
    )
    // 使用了代码规范也会安装 husky
    if (!needCodeLint) {
      devDependencies.push('husky')
    }
  }
}

function logDependencies(devDependencies: Dependencies, devDependenciesExactVersion: Dependencies) {
  console.log('\n将安装以下开发依赖（devDependencies）')
  for (let dep of [...devDependencies, ...devDependenciesExactVersion]) {
    console.log(`${dep}`)
  }
  console.log('\n')
}

export async function installDependencies(packageManager: PackageManager, devDependencies: Dependencies, devDependenciesExactVersion: Dependencies) {
  try {
    const installDevDependenciesCmd = {
      npm: `npm install --save-dev ${devDependencies.join(' ')}`,
      pnpm: `pnpm add --save-dev ${devDependencies.join(' ')}`,
      yarn: `yarn add --dev ${devDependencies.join(' ')}`,
    }[packageManager]
    console.log('\n开始安装开发依赖...')
    execSync(installDevDependenciesCmd, { stdio: 'inherit' })
    const installExactDevDependenciesCmd = {
      npm: `npm install --save-dev --save-exact ${devDependenciesExactVersion.join(' ')}`,
      pnpm: `pnpm add --save-dev --save-exact ${devDependenciesExactVersion.join(' ')}`,
      yarn: `yarn add --dev --exact ${devDependenciesExactVersion.join(' ')}`,
    }[packageManager]
    execSync(installExactDevDependenciesCmd, { stdio: 'inherit' })
    console.log('开发依赖安装成功！')
  } catch (err) {
    handleError('开发依赖安装失败', err)
  }
}

export function updatePackageJson(answers: Answers) {
  const packageJsonPath = join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  updateScript(answers, packageJson)
  updateConfig(answers, packageJson)
  updateLintStaged(answers, packageJson)
  writePackageJson(packageJsonPath, packageJson)
}

function updateScript(answers: Answers, packageJson: PackageJson) {
  const { needCodeLint, needCommitLint } = answers
  if (needCodeLint) {
    packageJson.scripts = {
      ...packageJson.scripts,
      lint: "lint-staged",
    }
  }
  if (needCommitLint) {
    packageJson.scripts = {
      ...packageJson.scripts,
      cz: 'git-cz'
    }
  }
  packageJson.scripts = {
    ...packageJson.scripts,
    prepare: 'husky',
  }
}

function updateConfig(answers: Answers, packageJson: PackageJson) {
  const { needCommitLint } = answers
  if (needCommitLint) {
    packageJson.config = {
      ...packageJson.config,
      commitizen: {
        path: "@commitlint/cz-commitlint"
      },
    }
  }
}

function updateLintStaged(answers: Answers, packageJson: PackageJson) {
  const { needCodeLint } = answers
  if (needCodeLint) {
    packageJson['lint-staged'] = {
      '*.{vue,ts,js}': [
        'eslint --fix',
        'prettier --write'
      ],
      '*.css': [
        "stylelint --fix",
        "prettier --write"
      ],
      '*.json': 'prettier --write'
    }
  }
}

function writePackageJson(packageJsonPath: string, packageJson: PackageJson) {
  try {
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
    console.log('package.json 更新成功')
  } catch (err) {
    handleError('更新 package.json 失败', err)
  }
}
