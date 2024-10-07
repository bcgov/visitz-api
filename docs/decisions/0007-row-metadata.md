[//]: # (bc-madr v0.1.0)
<!-- modified MADR 4.0.0 -->

# Row Metadata

* status: accepted <!-- proposed | rejected | accepted | deprecated | ... | superseded by ADR-0123 -->
* date: 2024-10-07 <!-- YYYY-MM-DD when the decision was last updated -->
* decision-makers: Todd Scharien <!-- list everyone involved in the decision -->

## Context and Problem Statement

We want any client apps to have standard contextual metadata available for any request they might make.

## Decision Drivers

* Client apps need to reliably store and update cached data

## Considered Options

* Provide row metadata in every response
* No other options were considered.

## Decision Outcome

Chosen option: "Provide row metadata in every response", because it's the only option considered and abides BC Gov REST API guidelines.

### Consequences

* Good, because client apps can use real primary keys, allowing them to upsert incoming data reliably
* Good, because client apps can reduce payloads by requesting records that have only been `updated-since` some timestamp
* Bad, because every object returned in a reponse will always have some minimum text included for metadata.
  * The extra minimum text included could be arguably negligible. Also, compared to existing implementations, it would be a complete improvement if we use an `updated-since` request mechanism.

### Confirmation

Through agile scrum, we will confirm row metadata is returned in all responses before each story acceptance and completion.
