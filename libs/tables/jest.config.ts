module.exports = {
  displayName: "tables",

  setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
  globals: {
    "ts-jest": {
      stringifyContentPathRegex: "\\.(html|svg)$",

      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  coverageDirectory: "../../coverage/libs/tables",
  snapshotSerializers: [
    "jest-preset-angular/build/serializers/no-ng-attributes",
    "jest-preset-angular/build/serializers/ng-snapshot",
    "jest-preset-angular/build/serializers/html-comment",
  ],
  transform: { "^.+\\.(ts|js|html)$": "jest-preset-angular" },
  preset: "../../jest.preset.ts",
};
