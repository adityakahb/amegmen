/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['./tests/resources/carouzel.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json', 'json-summary'],
  preset: 'jest-puppeteer',
  reporters: ['default', 'jest-puppeteer-istanbul/lib/reporter'],
  roots: ['tests'],
  setupFilesAfterEnv: ['jest-puppeteer-istanbul/lib/setup'],
  verbose: true,
  testURL: 'http://localhost:3001',
};
