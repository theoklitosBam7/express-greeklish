# express-greeklish

## 1.0.1

### Patch Changes

- [Bug Fix] (build) configure path aliases for imports
  - Replace relative import paths with absolute path aliases using the `@` prefix
  - Add module-alias package and configure \_moduleAliases in package.json to map `@` to `dist/src`
  - Update all import statements across the codebase to use the new alias pattern for cleaner and more maintainable imports

- [Style] (config) configure prettier and apply formatting

## 1.0.0

### Major Changes

- [Feature] (api) add v1 convert endpoint with metadata
  - Add POST /api/v1/convert with token-level correction metadata
  - Add /healthz and /readyz health monitoring endpoints
  - Implement request context middleware with request ID tracking
  - Add structured error handling with standardized error codes
  - Add text validation with 5000 character limit
  - Migrate from npm to pnpm with strict engine requirements
  - Add GitHub Actions CI workflow
  - Add Vitest test suite with unit and integration tests
  - Add benchmark script for performance testing
  - Update to Express 5.x and enable TypeScript strict mode
  - Maintain backward compatibility via GET /api/greeklish

- [BREAKING Build] require Node.js >=22 and pnpm >=10
