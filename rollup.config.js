import scss from "rollup-plugin-scss";
import ts from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";
import autoExternal from "rollup-plugin-auto-external";
export default [
  {
    input: "src/index.ts",
    output: {
      dir: "es",
      format: "esm",
      preserveModules: true,
    },
    plugins: [scss(), vue(), ts(), autoExternal()],
  },
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "cjs",
    },
    plugins: [
      scss(),
      vue(),
      ts({ tsconfigOverride: { compilerOptions: { target: "es5" } } }),
      autoExternal(),
    ],
  },
];
