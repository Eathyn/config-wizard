import { type Config } from 'prettier'

const prettierConfig: Config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  singleAttributePerLine: true,
  htmlWhitespaceSensitivity: 'ignore',
}

export default prettierConfig
