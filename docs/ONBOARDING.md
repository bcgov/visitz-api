## Project setup

Prerequistes:
- Node.js
- npm
- git (for git pre-commit hooks with husky)

To install the project, use

```bash
$ npm install
$ npm install -g pino-pretty
```
This will install all dependencies, as well as pre-commit hooks for formatting, linting and running tests.
Note the global install of pino-pretty is for prettifying logs when using watch, debug or development mode. This is so this dependency doesn't need to be installed in production.

## Compile and run the project

```bash
# development (will not rebuild on change)
$ npm run start

# watch mode (rebuilds on change)
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run build
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# unit tests with coverage information
$ npm run test:cov
```