/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  clearMocks: true,
  coverageProvider: "v8",
  moduleFileExtensions: ["js", "ts", "tsx", "node", "jsx"],
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.(test|spec).[tj]s"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  verbose: true, // Show detailed test results
};
