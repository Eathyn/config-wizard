export default function validateAnswers(answers: Answers) {
  const {
    needCodeLint,
    needCommitLint,
    moduleType,
    useTypeScript,
    framework,
    packageManager,
  } = answers
  const validModuleType: ModuleType[] = ['esm', 'cjs']
  const validFramework: Framework[] = ['vue', 'react']
  const validPackageManager: PackageManager[] = ['pnpm', 'npm', 'yarn']
  const errors: string[] = []
  if (typeof needCodeLint !== 'boolean') {
    errors.push('"是否需要代码规范" 的结果必须为布尔值')
  }
  if (typeof needCommitLint !== 'boolean') {
    errors.push('"是否需要提交规范" 的结果必须为布尔值')
  }
  if (!validModuleType.includes(moduleType)) {
    errors.push('"使用哪种模块规范" 的结果必须为 "esm" 或 "cjs"')
  }
  if (typeof useTypeScript !== 'boolean') {
    errors.push('"是否使用 TypeScript" 的结果必须为布尔值')
  }
  if (!validFramework.includes(framework)) {
    errors.push('"使用哪个框架" 的结果必须为 "vue" 或 "react"')
  }
  if (!validPackageManager.includes(packageManager)) {
    errors.push('"使用哪个包管理器" 的结果必须为 "pnpm" 或 "npm" 或 "yarn"')
  }
  return {
    isValid: errors.length === 0,
    errors,
  }
}