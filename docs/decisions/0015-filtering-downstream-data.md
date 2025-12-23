[//]: # (bc-madr v0.1.0)
<!-- modified MADR 4.0.0 -->

# Filtering downstream data

* status: accepted <!-- proposed | rejected | accepted | deprecated | ... | superseded by ADR-0123 -->
* date: 2025-12-02 <!-- YYYY-MM-DD when the decision was last updated -->
* decision-makers: Hannah MacDonald, Todd Scharien <!-- list everyone involved in the decision -->
* consulted: <!-- list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication --> <!-- OPTIONAL -->
* informed: <!-- list everyone who is kept up-to-date on progress; and with whom there is a one-way communication} --> <!-- OPTIONAL -->

## Context and Problem Statement

We want to encapsulate upstream responses (to an extent) so downstream clients are only shown what they need to see.

## Considered Options

* Filter `Link` field
* No other options were considered.

## Decision Outcome

Chosen option: "Filter `Link` field", because it is the only option considered.

### Consequences

* Good, because we can encapsulate Siebel functionality so downstream can focus more on data

* Negative consequences were not explored.
