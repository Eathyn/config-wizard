interface Answers {
  needCodeLint: boolean,
  needCommitLint: boolean,
  moduleType: ModuleType,
  useTypeScript: boolean,
  framework: Framework,
  packageManager: PackageManager,
}

type ModuleType = 'esm' | 'cjs'

type Framework = 'vue' | 'react'

type PackageManager = 'pnpm' | 'npm' | 'yarn'

type ToolName = 'eslint' | 'prettier' | 'stylelint' | 'commitlint'
