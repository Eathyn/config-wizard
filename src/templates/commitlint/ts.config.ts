import type { UserConfig } from '@commitlint/types'
import { RuleConfigSeverity } from '@commitlint/types'

const CommitlintConfig: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [
      RuleConfigSeverity.Error,
      'always',
      [
        'lower-case', // lower case
        'upper-case', // UPPERCASE
        'camel-case', // camelCase
        'kebab-case', // kebab-case
        'pascal-case', // PascalCase
        'sentence-case', // Sentence case
        'snake-case', // snake_case
        'start-case', // Start Case
      ]
    ]
  }
}

export default CommitlintConfig
