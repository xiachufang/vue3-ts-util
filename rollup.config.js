import scss from "rollup-plugin-scss";
import ts from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import autoExternal from "rollup-plugin-auto-external";
import { getBabelInputPlugin } from '@rollup/plugin-babel'
import styles from "rollup-plugin-styles";

const getPlugins = (esm = true) => [
  vue({ preprocessStyles: true  }),
  postcss([autoprefixer()]),
  autoExternal(),
  getBabelInputPlugin({
    include: ['src/**/*.tsx'],
    extensions: ['.tsx'],
    babelHelpers: 'inline',
    plugins: ['@vue/babel-plugin-jsx'],
    presets: [
      '@babel/preset-typescript'
    ]
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
