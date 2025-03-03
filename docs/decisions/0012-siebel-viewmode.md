[//]: # (bc-madr v0.1.0)
<!-- modified MADR 4.0.0 -->

# Siebel ViewMode

* status: accepted <!-- proposed | rejected | accepted | deprecated | ... | superseded by ADR-0123 -->
* date: 2025-02-27 <!-- YYYY-MM-DD when the decision was last updated -->
* decision-makers: Hannah MacDonald, Sagar Shah, Todd Scharien <!-- list everyone involved in the decision -->
* consulted: Leo Lou (ARB) <!-- list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication --> <!-- OPTIONAL -->
* informed: <!-- list everyone who is kept up-to-date on progress; and with whom there is a one-way communication} --> <!-- OPTIONAL -->

## Context and Problem Statement

We want to leverage a visibility mechanism as an authorization boundary to downstream clients.

## Decision Drivers

* Only show information downstream to those who are authorized to view it
* Require as little maintenance as feasible

## Considered Options

* Siebel ViewMode query parameter
* No other options were considered.

## Decision Outcome

Chosen option: "Siebel ViewMode query parameter", because it satisfies all decision drivers and is a built-in function in Siebel.

### Consequences

* Positive and negative consequences were not explored.

## More Information <!-- OPTIONAL -->

[About Access Controls for Siebel Business Component REST Requests](https://docs.oracle.com/cd/F26413_44/books/RestAPI/c-About-Access-Controls-for-Siebel-Business-Component-REST-Requests-ti1018560.html)
