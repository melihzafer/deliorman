const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/tests/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/src/app/_components/$1',
    '^@layouts/(.*)$': '<rootDir>/src/app/_layouts/$1',
    '^@library/(.*)$': '<rootDir>/src/app/_lib/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@common/(.*)$': '<rootDir>/src/app/_common/$1',
    '^@styles/(.*)$': '<rootDir>/src/app/_styles/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
