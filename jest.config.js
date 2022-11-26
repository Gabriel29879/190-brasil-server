const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')
require('dotenv').config({ path: './test/.env.test' })

module.exports = {
  preset: 'ts-jest',
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/config/*",
    "!src/config/plugins/*",
    "!src/utils/*",
    "!src/domain/*",
    "!src/index.ts"
  ],
  testPathIgnorePatterns: [".js"],
  maxWorkers: 4,
  globalSetup: "<rootDir>/test/utils/setup.ts",
  globalTeardown: "<rootDir>/test/utils/teardown.ts",
  verbose: true,

  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
}
