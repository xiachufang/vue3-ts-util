module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|vue)$': '<rootDir>/__mocks__/fileMock.js', // 暂时忽略vue
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js'
  },
};
