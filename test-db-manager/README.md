# Jore4 test db manager

Jore4 test db manager is intented to be used with e2e/integration tests.
It is implemented as separate package so that it can be used in different situations without direct dependency to `jore4-ui` project.

## Getting started

- Run `yarn build` for building the project. Add `--watch` flag to build automatically when something changes.
- Run `yarn qa` for running the same checks that CI does.

## Populating seed data to hasura

- Run `yarn seed` to populate seed dataset to development db

Note that most of the seed data is defined in `jore4-hasura` repository, in plain SQL statements.
Anyway, we needed to have some timetables seed data for UI development, and as it has many uuid references it is really difficult to do with SQL.
Thus it was decided to define it here.
Same dataset can be also used in e2e/integration tests if needed.
