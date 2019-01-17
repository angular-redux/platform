'use strict';

// Jest JUnit Reporter config
process.env.JEST_JUNIT_OUTPUT = './coverage/junit.xml';

module.exports = {
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.html$',
    },
  },
  transform: {
    '^.+\\.(ts|js|html)$':
      '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
  },
  testMatch: ['**/packages/**/*.spec.{ts,js}'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  setupTestFrameworkScriptFile: '<rootDir>/jest/tests-setup.ts',
  snapshotSerializers: [
    '<rootDir>/node_modules/jest-preset-angular/AngularSnapshotSerializer.js',
    '<rootDir>/node_modules/jest-preset-angular/HTMLCommentSerializer.js',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest/file.mock.ts',
  },
  modulePathIgnorePatterns: ['dist'],
  reporters: ['default', 'jest-junit'],
  collectCoverageFrom: [
    '**/packages/**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageReporters: ['lcov', 'text-summary'],
};
