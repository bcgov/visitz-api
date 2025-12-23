[//]: # (bc-madr v0.1)
<!-- modified MADR 4.0.0 -->

# Choose an E2E API testing framework

* status: accepted <!-- proposed | rejected | accepted | deprecated | ... | superseded by ADR-0123 -->
* date: 2025-12-02 <!-- YYYY-MM-DD when the decision was last updated -->
* decision-makers: Todd Scharien, Hannah MacDonald <!-- list everyone involved in the decision -->
* consulted: <!-- list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication --> <!-- OPTIONAL -->
* informed: <!-- list everyone who is kept up-to-date on progress; and with whom there is a one-way communication} --> <!-- OPTIONAL -->

## Context and Problem Statement

To test the OpenShift API, we want a reusable test suite solution that can hit the live instance and verify that it works as expected.

## Decision Drivers

* No required cloud features / storage of data
* Open source
* Has reusable api test suites
* Able to report via CLI

## Considered Options

* Postman
* Insomnia
* Cypress
* Playwright

## Decision Outcome

Chosen option: "Cypress", because it best satisfies the decision drivers.

### Consequences

* Good, because Cypress is open source with reusable test suites and CLI reporting options
* Neutral, because it is more of a FE testing framework than an API one

## Pros and Cons of the Options

### Postman / Newman

Standalone App / JavaScript | https://www.postman.com/ | [GitHub](https://github.com/postmanlabs/newman)

> Manage all of your APIs in Postman, with the industry's most complete API platform.

* Good, because it has all the features you would expect of an API test environment
* Good, because Newman is open source
* Good, because you can write resuable test suites for Newman in JavaScript
* Good, because Newman is a CLI collection runner tool with reporting options
* Bad, because Newman requires Postman collections, and Postman is not open source
* Bad, because Postman requires cloud use

### Insomnia | Inso CLI

Standalone App / JavaScript | https://insomnia.rest/ | [GitHub](https://github.com/Kong/insomnia)

> Insomnia is an open-source, cross-platform API client for GraphQL, REST, WebSockets, Server-sent events (SSE), gRPC and any other HTTP compatible protocol.

* Good, because it has all the features you would expect of an API test environment
* Good, because you can write resuable test suites in JavaScript
* Good, because Insomnia is open source
* Good, because Inso CLI is a CLI collection runner tool with reporting options
* Bad, because newer builds (past 2023.5.8) severely limit what can be done without a cloud account, including the collection runner and CLI

### Cypress

TypeScript/JavaScript | https://www.cypress.io/ | [GitHub](https://github.com/cypress-io/cypress)

> Fast, easy and reliable testing for anything that runs in a browser. 

* Good, because Cypress is open source
* Good, because you can write resuable test suites in TypeScript / JavaScript
* Good, because Cypress has API testing options, including GUI and CLI reporting
* Neutral, because while it has API testing options, it is more designed with FE testing in mind
* Neutral, because it has cloud options, but they can be ignored and an account is not required to run tests


### Playwright

TypeScript/JavaScript/Python/.NET/Java | https://playwright.dev/ | [GitHub](https://github.com/microsoft/playwright)

> Playwright is a framework for Web Testing and Automation. It allows testing Chromium, Firefox and WebKit with a single API. Playwright is built to enable cross-browser web automation that is ever-green, capable, reliable and fast.

* Good, because Playwright is open source
* Good, because you can write resuable test suites in all the above listed languages
* Good, because Playwright has API testing options with CLI reporting
* Neutral, because while it has API testing options, it is more designed with FE testing in mind
* Neutral, because it doesn't have a good GUI reporting option for API only tests

