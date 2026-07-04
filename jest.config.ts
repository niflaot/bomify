import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './'
})

const config: Config = {
  clearMocks: true,
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    '/node_modules/(?!@formatjs|intl-messageformat|next-intl|use-intl)/',
    '^.+\\.module\\.(css|sass|scss)$'
  ]
}

export default createJestConfig(config)
