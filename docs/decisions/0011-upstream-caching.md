[//]: # (bc-madr v0.1.0)
<!-- modified MADR 4.0.0 -->

# Upstream Caching

* status: accepted <!-- proposed | rejected | accepted | deprecated | ... | superseded by ADR-0123 -->
* date: 2025-12-02 <!-- YYYY-MM-DD when the decision was last updated -->
* decision-makers: Hannah MacDonald, Todd Scharien <!-- list everyone involved in the decision -->
* consulted: Karim Gillani, Sagar Shah <!-- list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication --> <!-- OPTIONAL -->
* informed: <!-- list everyone who is kept up-to-date on progress; and with whom there is a one-way communication} --> <!-- OPTIONAL -->

## Context and Problem Statement

To improve general performance, we want to cache repetitive upstream requests that we expect will return the same value often.

## Decision Drivers

* Faster downstream response times
* Less burden on upstream during bursts of requests
* Cache life short enough to react to upstream changes but long enough to handle bursts

## Considered Options

* Cache repetitive responses with detailed keys
* No other options were considered.

## Decision Outcome

Chosen option: "Cache repetitive responses with detailed keys", because we satisfy most of the decision drivers.

### Consequences

* Good, because using detailed/complex cache keys gives us flexibility to keep caches localized (for better real-time object access across a system) or targeted reusability across different objects.

* Bad, because caching for any amount of time means we won't be able to react to upstream data changes in real-time.

    * We can use a short-lived cache time to mitigate this, but it will always affect requests in some form.
