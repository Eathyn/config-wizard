import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  outDir: 'dist',
  splitting: false,
  treeshake: true,
  platform: 'node',
  target: 'node18',
  bundle: true,
  external: [
    '@inquirer/prompts',
    'commander',
    'chalk',
    'app-root-path'
  ]
})