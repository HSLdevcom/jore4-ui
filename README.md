# jore4-ui

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
Server-side rendering of Next.js is disabled as in this project it does not offer benefits wich could justify added complexity.

Next.js was still chosen over `create-react-app` as project template as it offers better tooling, better developer experience, much faster live reloads and better support for future needs.

## Getting Started

First, make sure you have the following apps installed:

- [ ] [yarn](https://yarnpkg.com/)
- [ ] [GithHub Shell](https://cli.github.com/), to authenticate to GitHub
  - On Mac, Homebrew command: `brew install gh`
- [ ] [PostgreSQL](https://www.postgresql.org/download/), to get required commands
  - On Mac, Homebrew command: `brew install postgresql@15`
- [ ] [Azure CLI](https://learn.microsoft.com/fi-fi/cli/azure/install-azure-cli)
  - On Mac, Homebrew command: `brew update && brew install azure-cli`

Once those are installed: initialize and update submodule (timetables-data-inserter):

```sh
git submodule update --init
```

Then we need to install dependencies with

```bash
yarn install
```

<details>
  <summary>
    NOTE: Build commands should be included in the commands that require them in package.json, but if for some reason still needed, check here
  </summary>

**build** the `test-db-manager` project:

```sh
cd /test-db-manager
yarn build
```

and **build** the timetables data inserter:

```
yarn ws:tdi timetables-data-inserter:build
```

</details>

Now we can start the development environment:

```bash
yarn dev # Can be run as `yarn ws:ui dev`, for a nicer development experience
```

> _NOTE_: Running `yarn ws:ui dev` runs only the UI project, without compiling test-db-manger on every change.

Open [http://localhost:3300](http://localhost:3300) with your browser to see the result.
In order to actually do something with the UI, see instructions below for starting up docker environment for providing rest of the dependencies.

## Tests & QA

### TypeScript

TypeScript's type checking can be run with `yarn ts:check`.
Please note that `test-db-manager` module has to be build before ts checks can pass as `cypress` module depends on the types that are generated on build.

### Code formatting

Code should be formatted with `prettier`. It is highly recommended for developers to set their editor to format code automatically with `prettier` every time when file is saved.
This way code magically stays neatly formatted and you don't have to do anything about it by yourself.
If you want to run prettier manually for some reason you can run `yarn prettier` (for writing changes) or `yarn prettier:check` (for making sure that code is formatted as prettier wants, but without modifying anything).

A convenience command `yarn qa:fix` exists for running `eslint` and `prettier` and fixing fixable issues.
This also uses cache for both formatters.

### Code style

We have enabled `eslint` with opionated rulesets for keeping code style clean & consistent and for avoiding certain mistakes. Eslint can be run with `yarn lint`. It is highly recommended for developers to use eslint extension with their editors so that they can see linting errors instantly when writing code.

Eslint can fix certain linting errors automatically when ran with `--fix` flag, e.g. `yarn lint --fix`.

For better testability (e.g. e2e tests), use the `data-testid` property at least with those DOM elements, which are important for user interaction.

### Local tests

For tests we use `jest`, `ts-jest` and `@testing-library/react`.
Ts-jest was chosen over `@babel/preset-typescript` as it has [certain advantages](https://kulshekhar.github.io/ts-jest/docs/babel7-or-ts/) such as type checking.
`@testing-library/react` is used with jest as it provides ways to interact with DOM.
Tests can be run with `yarn test`.

### "Integration" tests / "react hook e2e tests"

We also have integration tests for ui side that are run with `jest`.
We have those because sometimes there is need to do e.g. complex graphql queries on UI side, and those are impossible to test without running tests against real hasura instance.

- In order to run integration tests, you need to have hasura instance running. That is the case if you have docker-compose environment running.
- To run tests: `yarn test:integration`

### Cypress (e2e) tests

- In order to run e2e tests, you need to have ui and all the dependencies running. Start the dependencies with `./start-dependencies` when developing or running e2e tests.
- To open Cypress with browser for developing tests locally: `yarn test:e2e:open`
- To run all Cypress tests headlessly: `yarn test:e2e`
- To disable map tile rendering (e.g. to speed up tests or improve reliability in CI), set the `CYPRESS_DISABLE_MAP_TILES=true` environment variable
- To list existing e2e test cases run `yarn test:e2e:list`
- Tests have tags for features and other test sets, like `@smoke`. Run tests for a specific tag with `yarn test:e2e --env grepTags=@routes`, for example. Further Cypress grep documentation: <https://github.com/cypress-io/cypress/tree/develop/npm/grep>

Failed tests that have been run headlessly can be investigated visually by looking at videos and screenshots at `./cypress/reports`. Videos are disabled by default, and can be enabled in `cypress.config.ts` by setting the value of the `video` property to `true`.
Anyway, debugging is generally easier when Cypress is opened with browser as then you can poke around with browsers devtools.

### Local e2e test parallellization

- Cypress e2e tests can be run in parallel locally with the `yarn test:e2e:parallel` command. Parallel execution is built using the [cypress-parallel](https://github.com/tnicola/cypress-parallel) library.
- Parallel execution is not enabled in the CI currently.
- Currently tests can be run in a maximum of three threads.
- Parallel execution in three threads requires three separate instances of the `hasura` and `testdb` containers. These are started by default by the `start-dependencies.sh` script.
- Routing of requests in parallel execution is handled in the following files: `jore4-ui/test-db-manager/src/hasuraApi.ts`, `jore4-ui/test-db-manager/src/config.ts`, `jore4-ui/cypress/support/commands.ts`, `nginx.conf`

During parallel test execution Cypress assigns a value to `x-Environment` header value based on the current Cypress thread. Possible values are `e2e1`, `e2e2` and `e2e3`, and default value `e2e4` that is used when tests are not run in parallel, which also applies to using the environment manually. `e2e4` routes requests to `hasura` and `testdb` containers. In `docker-compose.custom.yml` the `HASURA_URL` environment value is set to point to the Hasura URL that the locally running UI is using to enable routing of the requests based on the `x-Environment` header value.

Parallel execution generates or updates a file called `parallel-weights.json`. The file contains numeric values that represent the execution time of each file. The values are used to assign the spec files into threads evenly. Changes to the `parallel-weights.json` file should be committed at least when new e2e tests are added, and when changes to existing tests increase their execution time considerably.

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

Run `./scripts/start-dependencies.sh` to set up microservices required for local development in docker-compose.
Script uses Jore4 project's shared docker-compose file defined in [`jore4-tools`](https://github.com/HSLdevcom/jore4-tools) repository.

Edit `start-dependencies.sh` script if you want to start only certain subset of our microservices.

For overriding settings defined in base docker-compose file just edit
`docker/docker-compose.custom.yml` and run `./scripts/start-dependencies.sh` again.

If you wish to persist the data in the database, start dependencies with `./scripts/start-dependencies.sh --volume`
By default the script starts e2e dependencies as well.
If you don't need them. you can start the dependencies with `./scripts/start-dependencies.sh --skip-e2e`

Docker containers can be stopped gracefully by running `./stop-dependencies.sh`

If docker setup seems to be in somehow non-working state, you can remove all containers by running `docker rm --force $(docker ps -aq)` and then start dependencies again.

You can also start the dependencies and run all seeds by running `./scripts/setup-dependencies-and-seed.sh`.
This will also download a dump from Azure and you will need to log in when prompted.
Internally the script calls `start-dependencies.sh` and forwards any arguments (eg. `--volume` and `--skip-e2e`) to it.

## Loading dump into development database

The jore3 importer microservice imports data from jore3 and converts it to be compatible with the jore4 datamodel. Existing dumps of this converted data can be found from Azure in `hsl-jore4-common / jore4storage / jore4-dump`

To download a dump to your local workspace, run `./scripts/development.sh dump:download` and follow the instructions.

To load this dump to your local development database instance, run `./scripts/development.sh dump:import` and follow the instructions. _Warning!_ This will empty your current database and overwrite all the data in it!

## Updating dump seed data

To update used dumps (`./test-db-manager/src/dumps/infraLinks/infraLinks.sql` dump and `./scripts/development.sh` default pgdump file), do the following:

- Check the latest suitable dump file in Azure `jore4-dump` container. The last part of the dump's name indicates the jore4-hasura -repository commit with which the dump is compatible with. Pin that hasura version in ui `docker-compose.custom.yml`. Restart dependencies and generate new GraphQL schema for new Hasura version and make necessary changes to achieve ui - hasura compatibility.
- Update default dump (`.pgdump` file) name in `./scripts/development.sh` and remove existing `jore4dump.pgdump` file from project directory. Then run stop dependencies and run `./scripts/setup-dependencies-and-seed.sh`.
- If everything goes right, after running the script and following the instructions you should now have database seeded with the new dump.
- Next, you should update used infrastructure link seed. To do this, have a look at contents of `./test-db-manager/src/dumps/infraLinks/infraLinks.sql` file. It contains data of infrastructure links. In the beginning of `dump.sql` (about row 30) there should be a copy command which seeds infrastructure links to db. The command starts with

`COPY infrastructure_network.infrastructure_link (infrastructure_link_id, direction, shape, estimated_length_in_metres, external_link_id, external_link_source) FROM stdin;`.

- Copy the command and the data rows immediately after it (about 150 000 rows total) and replace the same command in `infraLinks.sql` to update infrastructure seed data. Make sure you only copy infrastructure link data!

### Fixing timetables seed data

- After that you will need to fix some foreign key references to keep timetables seed functional. In `./test-db-manager/src/seed.ts` there are journey pattern ids (UUID), that you will need to replace to keep references from timetables to routes and lines timetables functional. To do this, search for the routes mentioned in the `seed.ts` comments from `dump.sql`. Make sure validity period and direction match to the one mentioned in the `seed.ts` file. Then take the found route's id and search for the route's journey pattern in the same file. Take the journey pattern id and replace the old journey pattern id in the `seed.ts` file with the new one. This step can also be done without using the dump file, e.g. using an SQL client or even the UI, as long as the db is seeded with the new dump.

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

## Updating Jest snapshots

Jest snapshots are used to test that the UI does not change unexpectedly. They need to be updated when there are structural changes to the pages, and can be updated by running `yarn test -u`

## Updating Node version

A script located at `scripts/update-node-version.sh` will update all node version numbers to a version given as a command line argument. For example `scripts/update-node-version.sh 18.19`.

After this, `yarn install` should be ran to update the lockfile.

## Graphql api/code generation

TS typings based on [Hasura](https://hasura.io/)'s api + `gql` queries/mutations from our codebase can generated by running `yarn ws:codegen generate`.
Script expects Hasura to be up & running at port mentioned in the script itself.
When developing it might be useful to run it with `--watch` flag so that TS typings are automatically updated when `gql` definitions are changed in our codebase: `yarn ws:codegen generate --watch`.

(Codegen is automatically started with `concurrently` when `yarn dev` is ran.)

## Icons

In this project we have saved our svg icons as icon font which is easy to use across the ui.

Current icon font can be previewed by opening (`src/generated/fontello/demo.html`)

Icon font can be updated by following these steps:

- Export desired svg icons from [JORE4 figma](https://www.figma.com/file/ImSTkCqQn0nhVUtMcUm41P/JORE-4.0-UX?node-id=1503%3A53530).
  (Right click, "Copy as SVG", save to a file with '.svg' extension)
- Import existing icon font's `config.json` (from directory `src/generated/fontello`) to [fontello](https://fontello.com/)
  (Import button is found under the wrench icon on the top of the page)
- Upload new icons to fontello's page. Please check that names of the icons make sense.
  (Use the same Import functionality as with `config.json`, but select svg files this time)
- Export new font from fontello. Replace contents of `src/generated/fontello` with the package that fontello provided.
  (Make sure you set the font name to `hsl-icons`)
- Use new icons where needed. 😎
  (`<i className="icon-xxx"/>`)

(**If you rename or remove existing icons**, do global search with old name to make sure that you don't break anything!
Intellisense doesn't notice if nonexisting icons are used in the project.)

If the imported SVG in Fontello does not look like the icon from Figma (e.g. outline circle is missing), follow these steps:
<https://medium.com/mabiloft/we-designed-an-icon-font-with-figma-and-fontello-and-it-has-not-been-a-piece-of-cake-b2948973738e>

## Map tiles

The background map tiles are loaded from [Digitransit](https://digitransit.fi/) and need an API key to download. The key is defined in the project secrets and will be downloaded to `.env.local` environment variables file when running the `./scripts/setup-dependencies-and-seed.sh` script. In docker environment the key will be loaded as a part of reading the secrets and stored in an environment variable.

## Coding style

### Inline components

**What?** Avoid using inline components unless it's a must.

**Why?** Using inline components makes them tightly coupled with their host component. When the child
component's functionality grows, it's going to be hard to detach it from the host component.

#### Bad inline components

```ts
export const EditButton: React.FC<Props> = (props) => {
  const { testId } = props;
  const href = (props as LinkProps)?.href;
  const onClick = (props as ButtonProps)?.onClick;

  const ButtonContent = () => (
    <div className="ml-5 h-10 w-10 rounded-full border border-grey bg-white">
      <MdModeEdit className="m-2 text-2xl text-tweaked-brand" />
    </div>
  );

  if (href) {
    return (
      <Link to={href} data-testid={testId}>
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button onClick={onClick} type="button" data-testid={testId}>
      <ButtonContent />
    </button>
  );
};
```

#### Good non-inline components

```ts
const ButtonContent = () => (
  <div className="ml-5 h-10 w-10 rounded-full border border-grey bg-white">
    <MdModeEdit className="m-2 text-2xl text-tweaked-brand" />
  </div>
);

export const EditButton: React.FC<Props> = (props) => {
  const { testId } = props;
  const href = (props as LinkProps)?.href;
  const onClick = (props as ButtonProps)?.onClick;

  if (href) {
    return (
      <Link to={href} data-testid={testId}>
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button onClick={onClick} type="button" data-testid={testId}>
      <ButtonContent />
    </button>
  );
};
```

### Namespaced imports

**What?** Strive on grouping imports together by namespace

**Why?** It's easier to follow what component/function is imported from where if they are namespaced

#### Bad grouping

```ts
import { EditButton } from '../../uiComponents';
import { SimpleDropdownMenu } from '../../uiComponents/SimpleDropdownMenu';
```

#### Good grouping

Import it like this:

```ts
import { EditButton, SimpleDropdownMenu } from '../../uiComponents';
```

`uiComponents/index.ts`:

```ts
export * from './EditButton';
export * from './SimpleDropdownMenu';
```

### Test ids

Example:
`ChangeValidityForm::startDateInput`
When giving test ids to elements, follow these guidelines.

- Use capital letters with component names eg. `ChangeValidityForm`
  - Otherwise use camelCase eg. `startdateInput`
- Use double colon `::` separating the different parts of the test id eg. `ChangeValidityForm::startDateInput`

Also use a `const testIds = {...}` object on top of the file to define the test ids instead of defining them inline.

#### Bad testIds

```ts
export const ChangeValidityForm = (...):  {
  ...
  <
    ...
    testId="ChangeValidityForm::startDateInput"
    ...
  />
}
```

#### Good testIds

```ts
const testIds = {
  startDateInput: 'ChangeValidityForm::startDateInput'
}

export const ChangeValidityForm = (...):  {
  ...
  <
    ...
    testId={testIds.startDateInput}
    ...
  />
}
```

### TailwindCSS

It is possible to override tailwindcss styles by adding overriding classname after the one that has to be overridden, but this is not default functionality. This could be needed when we want to customize a component which already has themes. For example `SimpleButton` already has paddings, but `SimpleSmallButton` needs smaller paddings. We don't want to use ! / important styles though, as they override everything and and are practically impossible to override.

It should be noted, that the order of classnames given to component does not automatically mean anything. The classes and styles are applied in the order that they are in the css file, which could be quite random and should not be relied on. For that reason we are using [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) package, which takes the order in account and removes the classnames which are overridden. Therefore whenever classnames are used so that the order should be taken into account, `twMerge` function should be used to combine the classnames.

## Loading state of async request handling / indication

To have consistency and reduce duplicated code and passing loading states through components we use redux for the loading state of async requests. We have `enum Operation` in `loader.ts` which contains different async operations e.g. `ConfirmTimetablesImport`. When making an async request, you can use the `setLoadingAction` with the correct `Operation` to handle the state. After this you can use the state how you please, but if you want to show the global `LoadingOverlay`, just add the chosen `Operation` to `joreOperations` in `loader.ts`.

## Yarn workspaces / monorepo structure

This repository has currently yarn workspaces in following folders:

- `ui` itself for the ui project
- `cypress` for e2e tests
- `codegen` for generating code based on graphql schema
- `test-db-manager` for handling db in tests (currently used only in `cypress` project)
- `timetables-data-inserter` for handling db in tests (new method) as a submodule (currently used only in `cypress` project)

Workspaces-specific dependencies should be installed to workspaces themselves and shared dependencies should be installed to workspace root.

Prettier and eslint live currently on workspace root as that allows having same config for those for all workspaces.

## Tips & Tricks

### Yarn lock changed (for no reason)

Did your `yarn.lock` file change without any reason? You can run the following chained commands to get a clean slate:

```sh
rm -rf node_modules; rm -rf cypress/node_modules/; rm -rf test-db-manager/node_modules/; rm -rf ui/node_modules/ &&
yarn cache clean &&
git checkout -- yarn.lock &&
yarn install
```

### Docker prune

Running a little low on memory, or the local setup doesn't work for a mystical reason?
Try pruning your docker registry:

```sh
docker system prune --all --volumes
```

## License

The project license is in [`LICENSE`](./LICENSE).

Digiroad data has been licensed with Creative Commons BY 4.0 license by the
[Finnish Transport Infrastructure Agency](https://vayla.fi/en/transport-network/data/digiroad/data).
