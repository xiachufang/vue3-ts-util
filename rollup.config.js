import ts from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";
import autoExternal from "rollup-plugin-auto-external";
import { getBabelInputPlugin } from '@rollup/plugin-babel'
import styles from "rollup-plugin-styles";

const getPlugins = (esm = true) => [
  vue({ preprocessStyles: true  }),
  styles(),
  autoExternal(),
  getBabelInputPlugin({
    include: ['src/**/*.{ts,tsx}'],
    extensions: ['.tsx'],
    babelHelpers: 'inline',
    configFile: './babel.config.js'
  }),
  ts(esm ? {} : { tsconfigOverride: { compilerOptions: { target: "es5" } } }),
]

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "es",
      format: "esm",
      preserveModules: true
    },
    plugins: getPlugins(),
  },
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "cjs",
    },
    plugins: getPlugins(false),
  },
];
