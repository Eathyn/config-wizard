import { Command } from 'commander';
import { confirm, select } from '@inquirer/prompts';
import { execSync } from 'child_process';
import path, { join } from 'path';
import fs, { writeFileSync, readFileSync } from 'fs';

// src/index.ts

// src/utils/error.ts
function handleError(message, error) {
  if (error instanceof Error) {
    if (message) {
      console.error(`
${message}: `);
    }
    console.error(error);
  } else {
    const err = new Error(`${JSON.stringify(error)}`);
    if (message) {
      console.error(`
${message}: `);
    }
    console.error(err);
  }
  process.exit(1);
}

// src/cli/prompts.ts
async function promptUser() {
  try {
    const needCodeLint = await confirm({
      message: "\u662F\u5426\u9700\u8981\u4EE3\u7801\u89C4\u8303\uFF1F",
      default: true
    });
    const needCommitLint = await confirm({
      message: "\u662F\u5426\u9700\u8981\u63D0\u4EA4\u89C4\u8303\uFF1F",
      default: true
    });
    if (!needCodeLint && !needCommitLint) {
      console.log("\u6240\u6709\u9009\u9879\u90FD\u9009\u62E9\u4E86\u5426\uFF0C\u7ED3\u675F\u6267\u884C\u3002");
      process.exit(0);
    }
    const moduleType = await select({
      message: "\u4F7F\u7528\u54EA\u79CD\u6A21\u5757\u89C4\u8303\uFF1F",
      choices: [
        {
          name: "ESM",
          value: "esm"
        },
        {
          name: "CommonJS",
          value: "cjs"
        }
      ]
    });
    const useTypeScript = await confirm({
      message: "\u662F\u5426\u4F7F\u7528 TypeScript\uFF1F",
      default: true
    });
    const framework = await select({
      message: "\u4F7F\u7528\u54EA\u4E2A\u6846\u67B6\uFF1F",
      choices: [
        {
          name: "Vue",
          value: "vue"
        },
        {
          name: "React",
          value: "react"
        }
      ]
    });
    const packageManager = await select({
      message: "\u4F7F\u7528\u54EA\u4E2A\u5305\u7BA1\u7406\u5668\uFF1F",
      choices: [
        {
          name: "pnpm",
          value: "pnpm"
        },
        {
          name: "npm",
          value: "npm"
        },
        {
          name: "yarn",
          value: "yarn"
        }
      ]
    });
    const answers = {
      needCodeLint,
      needCommitLint,
      moduleType,
      useTypeScript,
      framework,
      packageManager
    };
    return answers;
  } catch (err) {
    handleError("\u5904\u7406\u7528\u6237\u8F93\u5165\u65F6\u53D1\u751F\u9519\u8BEF", err);
  }
}
function getDependencies(answers) {
  const devDependencies = [];
  const devDependenciesExactVersion = [];
  addCodeLintDependencies(answers, devDependencies, devDependenciesExactVersion);
  addCommitLintDependencies(answers, devDependencies);
  logDependencies(devDependencies, devDependenciesExactVersion);
  return {
    devDependencies,
    devDependenciesExactVersion
  };
}
function addCodeLintDependencies(answers, devDependencies, devDependenciesExactVersion) {
  const { needCodeLint, framework, useTypeScript } = answers;
  if (!needCodeLint) return;
  devDependencies.push(
    "eslint",
    "@eslint/js",
    "globals",
    "eslint-config-prettier",
    "husky",
    "lint-staged",
    "stylelint",
    "stylelint-config-hudochenkov",
    "stylelint-config-standard-vue",
    "stylelint-order"
  );
  devDependenciesExactVersion.push("prettier");
  switch (framework) {
    case "vue":
      devDependencies.push("eslint-plugin-vue");
      break;
    case "react":
      devDependencies.push("eslint-plugin-react", "eslint-plugin-react-hooks");
      break;
  }
  if (useTypeScript) {
    devDependencies.push("typescript-eslint");
    devDependencies.push("jiti");
  }
}
function addCommitLintDependencies(answers, devDependencies) {
  const { needCommitLint, needCodeLint } = answers;
  if (needCommitLint) {
    devDependencies.push(
      "@commitlint/cli",
      "@commitlint/config-conventional",
      "@commitlint/cz-commitlint",
      "commitizen",
      "@commitlint/types"
    );
    if (!needCodeLint) {
      devDependencies.push("husky");
    }
  }
}
function logDependencies(devDependencies, devDependenciesExactVersion) {
  console.log("\n\u5C06\u5B89\u88C5\u4EE5\u4E0B\u5F00\u53D1\u4F9D\u8D56\uFF08devDependencies\uFF09");
  for (let dep of [...devDependencies, ...devDependenciesExactVersion]) {
    console.log(`${dep}`);
  }
  console.log("\n");
}
async function installDependencies(packageManager, devDependencies, devDependenciesExactVersion) {
  try {
    const installDevDependenciesCmd = {
      npm: `npm install --save-dev ${devDependencies.join(" ")}`,
      pnpm: `pnpm add --save-dev ${devDependencies.join(" ")}`,
      yarn: `yarn add --dev ${devDependencies.join(" ")}`
    }[packageManager];
    console.log("\n\u5F00\u59CB\u5B89\u88C5\u5F00\u53D1\u4F9D\u8D56...");
    execSync(installDevDependenciesCmd, { stdio: "inherit" });
    const installExactDevDependenciesCmd = {
      npm: `npm install --save-dev --save-exact ${devDependenciesExactVersion.join(" ")}`,
      pnpm: `pnpm add --save-dev --save-exact ${devDependenciesExactVersion.join(" ")}`,
      yarn: `yarn add --dev --exact ${devDependenciesExactVersion.join(" ")}`
    }[packageManager];
    execSync(installExactDevDependenciesCmd, { stdio: "inherit" });
    console.log("\u5F00\u53D1\u4F9D\u8D56\u5B89\u88C5\u6210\u529F\uFF01");
  } catch (err) {
    handleError("\u5F00\u53D1\u4F9D\u8D56\u5B89\u88C5\u5931\u8D25", err);
  }
}
function updatePackageJson(answers) {
  const packageJsonPath = join(process.cwd(), "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  updateScript(answers, packageJson);
  updateConfig(answers, packageJson);
  updateLintStaged(answers, packageJson);
  writePackageJson(packageJsonPath, packageJson);
}
function updateScript(answers, packageJson) {
  const { needCodeLint, needCommitLint } = answers;
  if (needCodeLint) {
    packageJson.scripts = {
      ...packageJson.scripts,
      lint: "lint-staged"
    };
  }
  if (needCommitLint) {
    packageJson.scripts = {
      ...packageJson.scripts,
      cz: "git-cz"
    };
  }
  packageJson.scripts = {
    ...packageJson.scripts,
    prepare: "husky"
  };
}
function updateConfig(answers, packageJson) {
  const { needCommitLint } = answers;
  if (needCommitLint) {
    packageJson.config = {
      ...packageJson.config,
      commitizen: {
        path: "@commitlint/cz-commitlint"
      }
    };
  }
}
function updateLintStaged(answers, packageJson) {
  const { needCodeLint } = answers;
  if (needCodeLint) {
    packageJson["lint-staged"] = {
      "*.{vue,ts,js}": [
        "eslint --fix",
        "prettier --write"
      ],
      "*.css": [
        "stylelint --fix",
        "prettier --write"
      ],
      "*.json": "prettier --write"
    };
  }
}
function writePackageJson(packageJsonPath, packageJson) {
  try {
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
    console.log("package.json \u66F4\u65B0\u6210\u529F");
  } catch (err) {
    handleError("\u66F4\u65B0 package.json \u5931\u8D25", err);
  }
}
function stringifyTemplate(dir, fileName) {
  const templatePath = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "templates", dir, fileName);
  console.log("templatePath: ", templatePath);
  return fs.readFileSync(templatePath, { encoding: "utf-8" });
}
function generateConfigFileName(moduleType, useTypeScript, toolName) {
  if (moduleType === "esm") {
    if (useTypeScript) {
      switch (toolName) {
        case "eslint":
          return "eslint.config.ts";
        case "prettier":
          return "prettier.config.js";
        case "stylelint":
          return "stylelint.config.js";
        case "commitlint":
          return "commitlint.config.ts";
        default:
          throw new Error("Unsupported tool name");
      }
    } else {
      switch (toolName) {
        case "eslint":
          return "eslint.config.js";
        case "prettier":
          return "prettier.config.js";
        case "stylelint":
          return "stylelint.config.js";
        case "commitlint":
          return "commitlint.config.js";
        default:
          throw new Error("Unsupported tool name");
      }
    }
  } else {
    if (useTypeScript) {
      switch (toolName) {
        case "eslint":
          return "eslint.config.mts";
        case "prettier":
          return "prettier.config.mts";
        case "stylelint":
          return "stylelint.config.mjs";
        case "commitlint":
          return "commitlint.config.mts";
        default:
          throw new Error("Unsupported tool name");
      }
    } else {
      switch (toolName) {
        case "eslint":
          return "eslint.config.mjs";
        case "prettier":
          return "prettier.config.mjs";
        case "stylelint":
          return "stylelint.config.mjs";
        case "commitlint":
          return "commitlint.config.mjs";
        default:
          throw new Error("Unsupported tool name");
      }
    }
  }
}

// src/generators/editorconfig.generator.ts
function generateEditorConfig() {
  try {
    const { fileName, fileContent } = getEditorConfig();
    const configPath = join(process.cwd(), fileName);
    console.log("configPath", configPath);
    writeFileSync(configPath, fileContent);
    console.log(`\u5DF2\u751F\u6210 .editorconfig \u914D\u7F6E\u6587\u4EF6\uFF1A${fileName}`);
  } catch (err) {
    handleError(".editorconfig \u914D\u7F6E\u6587\u4EF6\u751F\u6210\u5931\u8D25", err);
  }
}
function getEditorConfig() {
  return {
    fileName: ".editorconfig",
    fileContent: stringifyTemplate("editor", ".editorconfig")
  };
}
function generateEslintConfig(answers) {
  try {
    const { fileName, fileContent } = getEslintConfig(answers);
    const configPath = join(process.cwd(), fileName);
    writeFileSync(configPath, fileContent);
    console.log(`\u5DF2\u751F\u6210 ESLint \u914D\u7F6E\u6587\u4EF6\uFF1A${fileName}`);
  } catch (err) {
    handleError("ESLint \u914D\u7F6E\u6587\u4EF6\u751F\u6210\u5931\u8D25", err);
  }
}
function getEslintConfig(answers) {
  const { moduleType, framework, useTypeScript } = answers;
  const eslintFileName = generateConfigFileName(moduleType, useTypeScript, "eslint");
  if (framework === "vue") {
    if (useTypeScript) {
      return {
        fileName: eslintFileName,
        fileContent: stringifyTemplate("eslint", "vue-ts.config.js")
      };
    } else {
      return {
        fileName: eslintFileName,
        fileContent: stringifyTemplate("eslint", "vue-js.config.js")
      };
    }
  } else {
    if (useTypeScript) {
      return {
        fileName: eslintFileName,
        fileContent: stringifyTemplate("eslint", "react-ts.config.js")
      };
    } else {
      return {
        fileName: eslintFileName,
        fileContent: stringifyTemplate("eslint", "react-js.config.js")
      };
    }
  }
}
function generatePrettierConfig(answers) {
  try {
    const { fileName, fileContent } = getPrettierConfig(answers);
    const configPath = join(process.cwd(), fileName);
    writeFileSync(configPath, fileContent);
    console.log(`\u5DF2\u751F\u6210 Prettier \u914D\u7F6E\u6587\u4EF6\uFF1A${fileName}`);
  } catch (err) {
    handleError("Prettier \u914D\u7F6E\u6587\u4EF6\u751F\u6210\u5931\u8D25", err);
  }
}
function getPrettierConfig(answers) {
  const { moduleType, framework, useTypeScript } = answers;
  const prettierFileName = generateConfigFileName(moduleType, useTypeScript, "prettier");
  if (framework === "vue") {
    return {
      fileName: prettierFileName,
      fileContent: stringifyTemplate("prettier", "js.config.js")
    };
  } else {
    return {
      fileName: prettierFileName,
      fileContent: stringifyTemplate("prettier", "js.config.js")
    };
  }
}
function generateStylelintConfig(answers) {
  try {
    const { fileName, fileContent } = getStylelintConfig(answers);
    const configPath = join(process.cwd(), fileName);
    writeFileSync(configPath, fileContent);
    console.log(`\u5DF2\u751F\u6210 Stylelint \u914D\u7F6E\u6587\u4EF6\uFF1A${fileName}`);
  } catch (err) {
    handleError("Stylelint \u914D\u7F6E\u6587\u4EF6\u751F\u6210\u5931\u8D25", err);
  }
}
function getStylelintConfig(answers) {
  const { moduleType, framework, useTypeScript } = answers;
  const stylelintFileName = generateConfigFileName(moduleType, useTypeScript, "stylelint");
  if (framework === "vue") {
    return {
      fileName: stylelintFileName,
      // stylelint 还不支持 ts 文件：https://stylelint.io/user-guide/configure
      fileContent: stringifyTemplate("stylelint", "vue-js.config.js")
    };
  } else {
    return {
      fileName: stylelintFileName,
      fileContent: stringifyTemplate("stylelint", "react-js.config.js")
    };
  }
}
function generateCommitlintConfig(answers) {
  try {
    const { fileName, fileContent } = getCommitlintConfig(answers);
    const configPath = join(process.cwd(), fileName);
    writeFileSync(configPath, fileContent);
    console.log(`\u5DF2\u751F\u6210 commitlint \u914D\u7F6E\u6587\u4EF6\uFF1A${fileName}`);
  } catch (err) {
    handleError("commitlint \u914D\u7F6E\u6587\u4EF6\u751F\u6210\u5931\u8D25", err);
  }
}
function getCommitlintConfig(answers) {
  const { moduleType, framework, useTypeScript } = answers;
  const commitlintFileName = generateConfigFileName(moduleType, useTypeScript, "commitlint");
  if (framework === "vue") {
    if (useTypeScript) {
      return {
        fileName: commitlintFileName,
        fileContent: stringifyTemplate("commitlint", "ts.config.ts")
      };
    } else {
      return {
        fileName: commitlintFileName,
        fileContent: stringifyTemplate("commitlint", "js.config.js")
      };
    }
  } else {
    if (useTypeScript) {
      return {
        fileName: commitlintFileName,
        fileContent: stringifyTemplate("commitlint", "ts.config.ts")
      };
    } else {
      return {
        fileName: commitlintFileName,
        fileContent: stringifyTemplate("commitlint", "js.config.js")
      };
    }
  }
}
function generateGitHooks(answers) {
  const { packageManager, needCodeLint, needCommitLint } = answers;
  initHusky(packageManager);
  createPreCommitHook(needCodeLint);
  createCommitMessageHook(needCommitLint);
}
function initHusky(packageManager) {
  try {
    const huskyPrepareCmd = {
      npm: "npm run prepare",
      pnpm: "pnpm run prepare",
      yarn: "yarn run postinstall"
    }[packageManager];
    execSync(huskyPrepareCmd, { stdio: "inherit" });
    console.log("\u6210\u529F\u521D\u59CB\u5316 Husky");
  } catch (err) {
    handleError("\u521D\u59CB\u5316 Husky \u5931\u8D25", err);
  }
}
function createPreCommitHook(needCodeLint) {
  if (needCodeLint) {
    const preCommitPath = join(process.cwd(), ".husky", "pre-commit");
    const preCommitContent = `#!/usr/bin/env bash
pnpm run lint
`;
    try {
      writeFileSync(preCommitPath, preCommitContent);
      console.log("\u6210\u529F\u521B\u5EFA pre-commit \u94A9\u5B50");
    } catch (err) {
      handleError("\u521B\u5EFA pre-commit \u94A9\u5B50\u5931\u8D25", err);
    }
  }
}
function createCommitMessageHook(needCommitLint) {
  if (needCommitLint) {
    const commitMsgPath = join(process.cwd(), ".husky", "commit-msg");
    const commitMsgContent = `#!/usr/bin/env bash
pnpm commitlint --edit "$1"
`;
    try {
      writeFileSync(commitMsgPath, commitMsgContent);
      console.log("\u6210\u529F\u521B\u5EFA commit-msg \u94A9\u5B50");
    } catch (err) {
      handleError("\u521B\u5EFA commit-msg \u94A9\u5B50\u5931\u8D25", err);
    }
  }
}

// src/cli/validate.ts
function validateAnswers(answers) {
  const {
    needCodeLint,
    needCommitLint,
    moduleType,
    useTypeScript,
    framework,
    packageManager
  } = answers;
  const validModuleType = ["esm", "cjs"];
  const validFramework = ["vue", "react"];
  const validPackageManager = ["pnpm", "npm", "yarn"];
  const errors = [];
  if (typeof needCodeLint !== "boolean") {
    errors.push('"\u662F\u5426\u9700\u8981\u4EE3\u7801\u89C4\u8303" \u7684\u7ED3\u679C\u5FC5\u987B\u4E3A\u5E03\u5C14\u503C');
  }
  if (typeof needCommitLint !== "boolean") {
    errors.push('"\u662F\u5426\u9700\u8981\u63D0\u4EA4\u89C4\u8303" \u7684\u7ED3\u679C\u5FC5\u987B\u4E3A\u5E03\u5C14\u503C');
  }
  if (!validModuleType.includes(moduleType)) {
    errors.push('"\u4F7F\u7528\u54EA\u79CD\u6A21\u5757\u89C4\u8303" \u7684\u7ED3\u679C\u5FC5\u987B\u4E3A "esm" \u6216 "cjs"');
  }
  if (typeof useTypeScript !== "boolean") {
    errors.push('"\u662F\u5426\u4F7F\u7528 TypeScript" \u7684\u7ED3\u679C\u5FC5\u987B\u4E3A\u5E03\u5C14\u503C');
  }
  if (!validFramework.includes(framework)) {
    errors.push('"\u4F7F\u7528\u54EA\u4E2A\u6846\u67B6" \u7684\u7ED3\u679C\u5FC5\u987B\u4E3A "vue" \u6216 "react"');
  }
  if (!validPackageManager.includes(packageManager)) {
    errors.push('"\u4F7F\u7528\u54EA\u4E2A\u5305\u7BA1\u7406\u5668" \u7684\u7ED3\u679C\u5FC5\u987B\u4E3A "pnpm" \u6216 "npm" \u6216 "yarn"');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}

// src/index.ts
var program = new Command();
program.name("config wizard").version("1.0.0").description("config wizard").action(async () => {
  const answers = await promptUser();
  if (typeof answers === "undefined") {
    return;
  }
  const { isValid, errors } = validateAnswers(answers);
  if (!isValid) {
    console.error("\u4F60\u7684\u8F93\u5165\u5B58\u5728\u9519\u8BEF\uFF1A");
    console.error(errors.join("\n"));
    process.exit(1);
  }
  if (!answers.needCodeLint && !answers.needCommitLint) {
    console.log("\u4F60\u9009\u62E9\u4E86\u65E0\u9700\u4EE3\u7801\u89C4\u8303\u548C\u63D0\u4EA4\u89C4\u8303\uFF0C\u56E0\u6B64\u7A0B\u5E8F\u7ED3\u675F");
    process.exit(0);
  }
  const { devDependencies, devDependenciesExactVersion } = getDependencies(answers);
  const isInstallDependencies = await confirm({
    message: "\u662F\u5426\u7ACB\u523B\u5B89\u88C5\u8FD9\u4E9B\u4F9D\u8D56",
    default: true
  });
  if (isInstallDependencies) {
    await installDependencies(answers.packageManager, devDependencies, devDependenciesExactVersion);
  }
  if (answers.needCodeLint) {
    generateEditorConfig();
    generateEslintConfig(answers);
    generatePrettierConfig(answers);
    generateStylelintConfig(answers);
  }
  if (answers.needCommitLint) {
    generateCommitlintConfig(answers);
  }
  updatePackageJson(answers);
  generateGitHooks(answers);
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map