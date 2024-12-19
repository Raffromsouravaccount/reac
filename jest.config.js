// jest.config.js
const {defaults} = require('jest-config');
module.exports = {
  rootDir: "src",
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|ico|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/__tests__/_components/TvShow/*.js",
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/public/**",
  ],
  coverageDirectory: "coverage",
  globals: {
    "__JEST_TESTS__": true,
    "__isBrowser__": false
  },
  snapshotSerializers: [
    "enzyme-to-json/serializer"
  ],
  clearMocks: true
};
