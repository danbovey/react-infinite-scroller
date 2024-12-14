/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  collectCoverage: true,
  restoreMocks: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+.(j|t)sx?$': ['ts-jest', {}],
  },
};
