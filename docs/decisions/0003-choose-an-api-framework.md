[//]: # (bc-madr v0.1)
<!-- modified MADR 4.0.0 -->

# Choose an API framework

* status: proposed <!-- proposed | rejected | accepted | deprecated | ... | superseded by ADR-0123 -->
* date: 2024-09-19 <!-- YYYY-MM-DD when the decision was last updated -->
* decision-makers: Leo Lou (ARB), Keith Parkin (ARB), Todd Scharien, Fred Wen (ARB) <!-- list everyone involved in the decision -->
* consulted: Leo Lou (ARB) <!-- list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication --> <!-- OPTIONAL -->
* informed: <!-- list everyone who is kept up-to-date on progress; and with whom there is a one-way communication} --> <!-- OPTIONAL -->

## Context and Problem Statement

To keep development and maintenance of this middleware solution sane, we should use an established framework to build from.

## Decision Drivers

* Maintainability
* Easier to onboard new developers
* Community tooling and support
* Less boilerplate effort required overall

## Considered Options

* Express
* Bun
* go-micro
* Not using any framework

## Decision Outcome

Chosen option: "Express", because it best satisfies the decision drivers.

### Consequences

* Good, because it will be easier to onboard new developers and take advantage of the wealth of existing community tools and support
* Bad, because JavaScript was never explicitly designed for systems programming

## Pros and Cons of the Options

### Express

JavaScript | https://expressjs.com/ | [GitHub](https://github.com/expressjs/express)

> Fast, unopinionated, minimalist web framework for Node.js

* Good, because JavaScript and Node.js are popular with large communities
* Good, because JavaScript has oceans of libraries and packages available
* Good, because it has a powerful routing system
* Good, because it has good amounts of documentation available
* Neutral, because JavaScript is loosely typed
* Bad, because JavaScript was never explicitly designed for systems programming
* Bad, because JavaScript requires more care to keep the codebase clean

### Bun

JavaScript | https://bun.sh/ | [GitHub](https://github.com/oven-sh/bun)

> Develop, test, run, and bundle JavaScript & TypeScript projects—all with Bun. Bun is an all-in-one JavaScript runtime & toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager.

* Good, because JavaScript is a popular language with a large community
* Good, because JavaScript has oceans of libraries and packages available
* Good, because it is compatible with many things Node.js
* Good, because Bun can use Express
* Good, because includes a test runner
* Good, because it has good amounts of documentation available
* Neutral, because JavaScript is loosely typed
* Bad, because JavaScript was never explicitly designed for systems programming
* Bad, because JavaScript requires more care to keep the codebase clean

### go-micro

Go | https://go-micro.dev | [GitHub](https://github.com/micro/go-micro)

> Go Micro provides the core requirements for distributed systems development including RPC and Event driven communication. The Go Micro philosophy is sane defaults with a pluggable architecture. We provide defaults to get you started quickly but everything can be easily swapped out.

* Good, because Go is a popular language designed for systems programming
* Good, because Go has many libraries and packages available
* Good, because Go is strongly-typed
* Bad, because the future of the project may be unstable: [Notice: Looking for a new owner #2723](https://github.com/micro/go-micro/issues/2723)
* Bad, because there aren't as many Go developers aren't as there are JavaScript developers

### Not using any framework

Any language

* Good, because most amount of development freedom
* Bad, because we would need to come up with our own foundations ourselves
* Bad, because it would take the most amount of development time and effort
* Bad, because we would experience already-solved problems
