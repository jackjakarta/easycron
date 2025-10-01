import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['worker/index.ts'],
  outDir: 'dist/worker',
  format: ['cjs'],
  sourcemap: true,
  clean: true,
  minify: false,
  dts: false,
});
