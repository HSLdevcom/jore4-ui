# Copilot Instructions for jore4-ui

These instructions define how AI coding assistants should work in this repository.
Follow them for all code edits unless the user explicitly asks otherwise.

## 1) Repository context

- Monorepo with Yarn workspaces.
- Main workspaces:
  - `ui` (main application)
  - `cypress` (e2e tests)
  - `codegen` (GraphQL code generation)
  - `test-db-manager` (test DB tooling)
  - `timetables-data-inserter` (submodule)
- Git submodules:
  - `timetables-data-inserter` — test data tooling, used in e2e tests
  - `jore4-hasura` — Hasura configuration; in development, jore4-hasura is pulled from the container registry and run as a Docker container. This submodule is present only for e2e tests.
- Prefer workspace-scoped commands (`yarn ws:...`) when possible.

## 2) Default development workflow

- Prefer day-to-day development flow:
  - `yarn ws:ui dev`
  - Run GraphQL generation manually when needed: `yarn ws:codegen generate`
- Avoid defaulting to `yarn dev` for normal edits because continuous codegen can heavily degrade IDE performance.
- If test-db seed data is changed, rebuild with `yarn ws:db build`.

## 3) Environment and dependencies

- For local backend dependencies, use `./scripts/development.sh` commands (for example `start:deps`, `setup:env`, `setup:test`, `stop`).
- Do not introduce alternative local orchestration scripts if existing script targets are sufficient.
- Assume UI runs on `http://localhost:3300` when using local dev server.

## 4) Quality gates and verification

Before finalizing a non-trivial change, run the smallest relevant checks first, then broaden only as needed:

1. Targeted checks for changed area (tests/lint where applicable)
2. Type checking: `yarn ts:check`
3. Linting: `yarn lint` (or `yarn lint --fix` when safe)
4. Formatting: `yarn prettier:check` (or `yarn prettier` when formatting is required)

Use `yarn qa` for full local validation when appropriate.
Use `yarn qa:fix` for automatic eslint/prettier fixes.

## 5) Testing guidance

- Unit/local tests: `yarn test`
- Integration tests (require Hasura/deps running): `yarn test:integration`
- E2E tests:
  - Open mode: `yarn test:e2e:open`
  - Headless: `yarn test:e2e`
  - Tag filtering example: `yarn test:e2e --env grepTags=@routes`
- For map-related Cypress reliability/speed, optionally set `CYPRESS_DISABLE_MAP_TILES=true`.
- When adding or changing user-interactive UI elements, include stable `data-testid` attributes.

## 6) GraphQL codegen rules

- GraphQL typings are generated from Hasura schema and `gql` definitions.
- Because generation is heavy in this repo, prefer manual generation after finishing query edits:
  - `yarn ws:codegen generate`
- Do not set up automatic codegen watch flows unless explicitly requested.

## 7) Code style conventions

### General

- Keep changes minimal and scoped to the task.
- Follow existing TypeScript/React patterns in the touched area.
- Prefer editor/CI-aligned formatting and lint behavior over custom style choices.

### Components

- Avoid inline child components unless necessary; prefer extracted components.
- Keep components composable and loosely coupled.

### Imports

- Prefer namespaced/barrel imports where available instead of fragmented deep imports.

### Test IDs

- Use `data-testid` for important interaction elements.
- Follow naming convention: `ComponentName::camelCaseElementName`.
- Define test IDs via a top-level `const testIds = { ... }` object instead of inline string literals where practical.

### Tailwind class composition

- Use `twJoin` for simple class concatenation and pass-through patterns.
- Use `twMerge` as final composition step when conflicting utility classes are possible.
- Do not rely on raw class order alone for override behavior.

## 8) Workspace dependency management

- Install workspace-specific dependencies into the correct workspace.
- Install shared dependencies in repository root only when truly shared.
- Do not move lint/prettier config out of root without explicit request.

## 9) Git workflow

- The user always makes git commits themselves. Never commit or offer to commit on behalf of the user.

## 10) Operational guardrails for AI edits

- Do not refactor unrelated areas.
- Do not add new frameworks, state libraries, or architectural patterns without request.
- Do not rewrite existing scripts when existing `yarn` and `development.sh` flows solve the task.
- Keep generated-file churn minimal; regenerate only when required by changes.
- When uncertain about behavior that depends on running services (Hasura, Docker stack, db seeds), state assumptions and choose the safest minimal change.
- Avoid writing unnecessary comments. Explain your changes in chat instead of code comments.
- Comments should be added only if they provide value beyond what the code itself can express. If you think a comment is needed, consider whether the code can be refactored to be more self-explanatory instead.

## 11) Helpful commands reference

- Dev UI only: `yarn ws:ui dev`
- Full dev (heavy): `yarn dev`
- GraphQL codegen: `yarn ws:codegen generate`
- Build test DB manager: `yarn ws:db build`
- Type check: `yarn ts:check`
- Lint: `yarn lint`
- Format check: `yarn prettier:check`
- Full QA: `yarn qa`
- Unit tests: `yarn test`
- Integration tests: `yarn test:integration`
- E2E tests: `yarn test:e2e`
- Start dependencies: `./scripts/development.sh start:deps`
- Stop dependencies: `./scripts/development.sh stop`
