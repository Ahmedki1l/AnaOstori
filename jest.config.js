// Jest config for unit tests. Uses next/jest so CSS-module imports, path
// aliases and the Next babel/swc transform work the same as in the app build.
// E2E specs live under e2e/ and are run by Playwright, not Jest — excluded here.
const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['**/?(*.)+(test).js'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/e2e/'],
}

module.exports = createJestConfig(customJestConfig)
