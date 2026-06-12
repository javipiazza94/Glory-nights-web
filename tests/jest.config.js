module.exports = {
  rootDir: '..',
  testMatch: ['**/tests/**/*.test.(ts|tsx|js)'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // handle .js, .jsx, .ts, .tsx
  },
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/tests/__mocks__/styleMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
};