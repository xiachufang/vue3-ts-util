module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|vue)$': '<rootDir>/__mocks__/fileMock.js', // 暂时忽略vue
    'inject-css.js$': '<rootDir>/__mocks__/cssInject.js', // babel好像把node_module给忽略了
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js'
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
};
