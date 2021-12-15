# jore4-ui

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
Server-side rendering of Next.js is disabled as in this project it does not offer benefits wich could justify added complexity.

Next.js was still chosen over `create-react-app` as project template as it offers better tooling, better developer experience, much faster live reloads and better support for future needs.

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3300](http://localhost:3300) with your browser to see the result.

## Tests & QA

### TypeScript

TypeScript's type checking can be run with `yarn ts:check`.

### Code formatting

Code should be formatted with `prettier`. It is highly recommended for developers to set their editor to format code automatically with `prettier` every time when file is saved.
This way code magically stays neatly formatted and you don't have to do anything about it by yourself.
If you want to run prettier manually for some reason you can run `yarn prettier` (for writing changes) or `yarn prettier:check` (for making sure that code is formatted as prettier wants, but without modifying anything).

### Code style

We have enabled `eslint` with opionated rulesets for keeping code style clean & consistent and for avoiding certain mistakes. Eslint can be run with `yarn lint`. It is highly recommended for developers to use eslint extension with their editors so that they can see linting errors instantly when writing code.

Eslint can fix certain linting errors automatically when ran with `--fix` flag, e.g. `yarn lint --fix`.

For better testability (e.g. e2e tests), use the `id` property at least with those DOM elements, which are important for user interaction.

### Local tests

For tests we use `jest`, `ts-jest` and `@testing-library/react`.
Ts-jest was chosen over `@babel/preset-typescript` as it has [certain advantages](https://kulshekhar.github.io/ts-jest/docs/babel7-or-ts/) such as type checking.
`@testing-library/react` is used with jest as it provides ways to interact with DOM.
Tests can be run with `yarn test`.

### CI

CI runs all type checking, prettier, linter and tests for each pull request. But as a developer, your responsibility is to make sure that all of those tools stay happy (=do not give any errors or warnings) after each commit. As a convenience we have `yarn qa` script which runs all of those in one step. Thus it can be used locally for checking that everything is fine.

### Recommended tooling

If you use VSCode, following plugins are recommended:

- [esbenp.prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for formatting code automatically with `prettier`
- [dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for showing linting errors within the code
- [bradlc.vscode-tailwindcss](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) for adding Tailwind suggestions to IntelliSense

It is also recommended to enable the [organize imports](https://code.visualstudio.com/docs/languages/typescript#_organize-imports) feature so that the imports will be ordered as the linter wants automatically.
Non-VSCode users can sort imports e.g. by running `yarn lint --fix` on command line.
(Probably there are also ways to configure other IDE's to order imports automatically or a way to make them run the linter with `--fix` flag automatically when code file is saved.)

## Setting up dependencies for local development

Run `./start-dependencies.sh` to set up microservices required for local deveopment in docker-compose.
Script uses Jore4 project's shared docker-compose file defined in [`jore4-flux`](https://github.com/HSLdevcom/jore4-flux#docker-compose) repository.
Edit `start-dependencies.sh` script if you want to start only certain subset of our microservices.
For overriding settings defined in base docker-compose file just edit
`docker/docker-compose.custom.yml` and run `./start-dependencies.sh` again.
Docker containers can be stopped gracefully by running `./stop-dependencies.sh`
If docker setup seems to be in somehow non-working state, you can remove all containers by running `docker rm --force $(docker ps -aq)` and then start dependencies again.

**NOTE:** Currently (14.10.2021) authentication backend has a bug which causes it to boot up non-working state when started with this docker-compose. As a workaround you should run `docker restart auth` after all services are succesfully up & running.

## Docker reference

**Docker image doesn't expect any environment variables from outside.**
The Docker image expects that the backend calls are routed under the same baseurl as it references them via a relative path.

### Testing locally

Docker image can be tested locally like this:

```bash
# optional: build builder image to support caching, so that you don't have to e.g. run yarn install from scratch every time even if dependencies have stayed the same
docker build --cache-from=jore4-ui:temp-builder --target build -t jore4-ui:temp-builder .
# build docker image and utilize cache from previous step if available
docker build -t jore4-ui:temp --cache-from=jore4-ui:temp-builder --cache-from=jore4-ui:temp .
# serve image in port 8080
docker run -p 8080:80 jore4-ui:temp
```

## Graphql api/code generation

TS typings based on hasura's api + `gql` queries/mutations from our codebase can generated by running `yarn gql:generate-types`.
Script expects hasura to be up & running at port mentioned in the script itself.
When developing it might be useful to run it with `--watch` flag so that TS typings are automatically updated when `gql` definitions are changed in our codebase: `yarn gql:generate-types --watch`

## Icons

In this project we have saved our svg icons as icon font which is easy to use across the ui.

Current icon font can be previewed by opening (`src/generated/fontello/demo.html`)

Icon font can be updated by following these steps:

- Export desired svg icons from [JORE4 figma](https://www.figma.com/file/ImSTkCqQn0nhVUtMcUm41P/JORE-4.0-UX?node-id=1503%3A53530).
- Import exsisting icon font's `config.json` (from directory `src/generated/fontello`) to [fontello](https://fontello.com/)
- Upload new icons to fontello's page. Please check that names of the icons make sense.
- Export new font from fontello. Replace contents of `src/generated/fontello` with the package that fontello provided.
- Use new icons where needed. 😎

(**If you rename or remove existing icons**, do global search with old name to make sure that you don't break anything!
Intellisense doesn't notice if nonexisting icons are used in the project.)

## Experimenting with digiroad network and pre-calculated vector tiles

Primary way of presenting vector tiles in UI will be using pre-calculated vector tiles.
They offer much better performance compared to dynamically calculating those on-demand.
By default they are served from `jore4-mbtiles-server` which is started by `start-dependencies.sh` script.

## Experimenting with dynamic vector tiles

**This experiment was done mainly for being able to draw links/stops on map before we had real data available. Thus workflow is quite clumsy and not intended to be used in normal development workflow.**
Anyway, using dynamic vector tiles might be useful when quickly experimenting with something and thus instructions are left here for future reference.

To import digiroad data to local db in order to be able to draw vector tiles on the map:

- Start local db by running `docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.custom.yml -d up postgis`.
- Import digiroad network by following readme in [`jore4-digiroad-import-experiment`](https://github.com/HSLdevcom/jore4-digiroad-import-experiment) repository's `r_material` branch.
  Import network to the previously started db, or then edit `/docker/docker-compose.custom.yml` to make `martin` use db of your choice.
  _Please note that `r_material` branch is still more or less WIP and thus theres no guarantees that it is going to stay compatible with these steps in the future._
- Transform digiroad network's geometry to martin-friendly geometry by running following sql statements to your local db. (psql console can be started by running `psql -U postgres -h localhost -d db -p 25432`. If you use db different than the one started in docker-compose, edit connection parameters accordingly.)

```sql
SELECT AddGeometryColumn('digiroad', 'dr_linkki', 'geom_new', 4326, 'LINESTRING', 3);
UPDATE digiroad.dr_linkki SET geom_new = ST_Transform(geom, 4326);
ALTER TABLE digiroad.dr_linkki ALTER COLUMN geom_new SET NOT NULL;
-- ALTER TABLE digiroad.dr_linkki RENAME COLUMN geom TO geom_3067;
ALTER TABLE digiroad.dr_linkki DROP COLUMN geom;
ALTER TABLE digiroad.dr_linkki RENAME COLUMN geom_new TO geom;
```

```sql
SELECT AddGeometryColumn('digiroad', 'dr_pysakki', 'geom_new', 4326, 'POINT', 2);
UPDATE digiroad.dr_pysakki SET geom_new = ST_Transform(geom, 4326);
ALTER TABLE digiroad.dr_pysakki ALTER COLUMN geom_new SET NOT NULL;
ALTER TABLE digiroad.dr_pysakki DROP COLUMN geom;
ALTER TABLE digiroad.dr_pysakki RENAME COLUMN geom_new TO geom;
```

- Start `martin` to start serving vector tiles locally by running `docker-compose -f ./docker/docker-compose.yml -f ./docker/docker-compose.custom.yml up -d martin`

### Showing infrastructure links, stops and example route in UI

![][logo]

[logo]: https://jore4storage.blob.core.windows.net/jore4-ui/ui-toggles-v2.png

Maps in UI has four to five toggles depending on situation:

- **1. a** show/hide infrastructure links served from jore4-mbtiles-server
- **1. b** show/hide infrastructure links served from martin
- **1. c** show/hide route (Not available if no route is selected)
- **2. a** show/hide stops served from jore4-mbtiles-server
- **2. b** show/hide stops served from martin
