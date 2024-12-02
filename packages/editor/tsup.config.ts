import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
  entry: ['src/**/*.ts'],
  format: ['esm'],
  dts: true,
  silent: true,
  ...options,
}))
