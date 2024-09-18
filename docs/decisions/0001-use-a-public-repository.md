[//]: # (bc-madr v0.1)
<!-- modified MADR 4.0.0 -->

# Use a public repository to store project code

* status: accepted
* date: 2024-09-18
* decision-makers: Leo Lou, Todd Scharien

## Context and Problem Statement

We would like to code in the open but that may be an issue due to the potentially sensitive nature of upstream systems.

## Decision Drivers

* Want the value that open-source brings
* Avoid leaking potentially sensitive information

## Considered Options

* Make repo public
* Make repo private

## Decision Outcome

Chosen option: "Make repo public".

### Consequences

* Good, because we follow [BC Gov recommended policies](https://digital.gov.bc.ca/policies-standards/dcop/open/)
* Neutral, we must be vigilant that we don't leak any PII or sensitive system information.
* Bad, if we end up exposing sensitive information.

## Pros and Cons of the Options

### Make repo public

* Good, because we'd follow [BC Gov recommended policies](https://digital.gov.bc.ca/policies-standards/dcop/open/)
* Bad, because sensitive information about systems could be exposed

### Make repo private

* Good, because helps protect against leaking sensitive information by default
* Good, because work can be committed into git history immediately without requiring privacy review
* Bad, because does not follow [BC Gov recommended policies](https://digital.gov.bc.ca/policies-standards/dcop/open/)
