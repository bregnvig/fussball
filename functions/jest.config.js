module.exports = {
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest'
  },
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  testPathIgnorePatterns: ['node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  verbose: true,
  rootDir: 'src',
  testTimeout: 20000
}




