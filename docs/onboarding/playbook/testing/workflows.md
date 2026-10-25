# Testing Workflows Playbook

## 1. **Native Test Runner**
Execute the native `node:test` framework using the predefined script:
`pnpm test`

## 2. **Test Rules**
- **No External Test Frameworks**: Do not use Jest or Vitest; rely solely on native testing tools as configured in `package.json`.
- **Typescript Testing**: Tests are run using `node --experimental-strip-types` to automatically handle TypeScript execution natively.
