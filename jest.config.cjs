/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  // Co-located with source: src/services/foo.ts → src/services/foo.test.ts
  testMatch: ['<rootDir>/src/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.cjs',
    '\\.(svg|png|jpg|jpeg|gif|webp|ico)$':
      '<rootDir>/tests/__mocks__/fileMock.cjs',
  },
  transform: {
    '^.+\\.(t|j)sx?$': ['babel-jest', {configFile: './babel.jest.cjs'}],
  },
  transformIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
