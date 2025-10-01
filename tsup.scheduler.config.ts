import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['scheduler/index.ts'],
  outDir: 'dist/scheduler',
  format: ['cjs'], // BullMQ expects CommonJS
  sourcemap: true,
  clean: true,
  minify: false, // turn on in prod if you like
  dts: false, // no need for types at runtime
});
