module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: './test', // Убедитесь, что корневая директория установлена правильно
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
  };