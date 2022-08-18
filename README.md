# jore4-ui

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
Server-side rendering of Next.js is disabled as in this project it does not offer benefits wich could justify added complexity.

Next.js was still chosen over `create-react-app` as project template as it offers better tooling, better developer experience, much faster live reloads and better support for future needs.

## Getting Started

First, make sure you have [yarn](https://yarnpkg.com/) installed.

Then, install dependencies and start the development server:

```bash
yarn install
yarn ws:ui dev
```

Open [http://localhost:3300](http://localhost:3300) with your browser to see the result.
In order to actually do something with the UI, see instructions below for starting up docker environment for providing rest of the dependencies.

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

For better testability (e.g. e2e tests), use the `data-testid` property at least with those DOM elements, which are important for user interaction.

### Local tests

For tests we use `jest`, `ts-jest` and `@testing-library/react`.
Ts-jest was chosen over `@babel/preset-typescript` as it has [certain advantages](https://kulshekhar.github.io/ts-jest/docs/babel7-or-ts/) such as type checking.
`@testing-library/react` is used with jest as it provides ways to interact with DOM.
Tests can be run with `yarn test`.

### Cypress (e2e) tests

- In order to run e2e tests, you need to have ui and all the dependencies running.
- To open cypress with browser for developing tests locally: `yarn test:e2e:open`
- To run all cypress tests without browser: `yarn test:e2e`

Failed tests ran without browser can be investigated visually by looking at videos at `./cypress/videos` and photos at `./cypress/screenshots`.
Anyway, debugging is generally easier when cypress is opened with browser as then you can poke around with browsers devtools.

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

Run `./start-dependencies.sh` to set up microservices required for local development in docker-compose.
Script uses Jore4 project's shared docker-compose file defined in [`jore4-flux`](https://github.com/HSLdevcom/jore4-flux#docker-compose) repository.
Edit `start-dependencies.sh` script if you want to start only certain subset of our microservices.
For overriding settings defined in base docker-compose file just edit
`docker/docker-compose.custom.yml` and run `./start-dependencies.sh` again.
If you wish to persist the data in the database, start dependencies with `./start-dependencies.sh --volume`
Docker containers can be stopped gracefully by running `./stop-dependencies.sh`
If docker setup seems to be in somehow non-working state, you can remove all containers by running `docker rm --force $(docker ps -aq)` and then start dependencies again.

## Loading dump into development database

The jore3 importer microservice imports data from jore3 and converts it to be compatible with the jore4 datamodel. Existing dumps of this converted data can be found from Azure in `hsl-jore4-common / jore4storage / jore4-dump`

To download a dump to your local workspace, run `./development.sh dump:download` and follow the instructions.

To load this dump to your local development database instance, run `./development.sh dump:import` and follow the instructions. _Warning!_ This will empty your current database and overwrite all the data in it!

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

TS typings based on hasura's api + `gql` queries/mutations from our codebase can generated by running `yarn ws:codegen generate`.
Script expects hasura to be up & running at port mentioned in the script itself.
When developing it might be useful to run it with `--watch` flag so that TS typings are automatically updated when `gql` definitions are changed in our codebase: `yarn ws:codegen generate --watch`

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
https://medium.com/mabiloft/we-designed-an-icon-font-with-figma-and-fontello-and-it-has-not-been-a-piece-of-cake-b2948973738e

## Coding style

### Inline components

**What?** Avoid using inline components unless it's a must.

**Why?** Using inline components makes them tightly coupled with their host component. When the child
component's functionality grows, it's going to be hard to detach it from the host component.

**Bad**

```
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

**Good**

```
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

**Bad**

```
import { EditButton } from '../../uiComponents';
import { SimpleDropdownMenu } from '../../uiComponents/SimpleDropdownMenu';
```

**Good**

Import it like this:

```
import { EditButton, SimpleDropdownMenu } from '../../uiComponents';
```

uiComponents/index.ts:

```
export * from './EditButton';
export * from './SimpleDropdownMenu';
```

## Yarn workspaces / monorepo structure

This repository has currently three different yarn workspaces in following folders:

- `ui` itself for the ui project
- `cypress` for e2e tests
- `test-db-manager` for handling db in tests (currently used only in `cypress` project)

Workspaces-specific dependencies should be installed to workspaces themselfs and shared dependencies should be installed to workspace root.

Prettier and eslint live currently on workspace root as that allows having same config for those for all workspaces.
