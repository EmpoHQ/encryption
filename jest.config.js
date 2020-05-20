module.exports = {
  preset: 'ts-jest',
  coverageReporters: [
    ['lcov', {
      projectRoot: '..'
    }]
  ],
  testEnvironment: 'node'
}
