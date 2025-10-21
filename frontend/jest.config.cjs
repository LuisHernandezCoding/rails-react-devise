module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    // Use babel-jest for JS files (so ESM in node_modules can be transformed)
    '^.+\\.jsx?$': 'babel-jest',
    // Use ts-jest for TypeScript files and pass a Jest-friendly tsconfig
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  // Map the real API service to a lightweight mock during tests to avoid
  // Vite-specific import.meta usage.
  moduleNameMapper: {
    '^src/services/api$': '<rootDir>/src/__mocks__/services/api.ts',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // Some dependencies (like msw and its helpers) publish ESM syntax that
  // Jest needs to transform. Allow transforming these specific packages.
  transformIgnorePatterns: ['node_modules/(?!(msw|@mswjs|until-async)/)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
}
