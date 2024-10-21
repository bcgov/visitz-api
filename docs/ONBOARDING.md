## Project setup

Prerequistes:
- Node.js
- npm
- git (for git pre-commit hooks with husky)

To install the project, use

```bash
$ npm install
```
This will install all dependencies, as well as pre-commit hooks for formatting, linting and running tests.

## Compile and run the project

```bash
# development (will not rebuild on change)
$ npm run start

# watch mode (rebuilds on change)
$ npm run start:dev

# production mode
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