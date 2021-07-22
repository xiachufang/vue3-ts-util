module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript'
  ],
  plugins: [
    [require('@vue/babel-plugin-jsx'), { optimize: true, isCustomElement: (tag) => /^x-/.test(tag) }],
  ],
};
