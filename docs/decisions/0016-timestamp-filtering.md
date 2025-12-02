[//]: # (bc-madr v0.1.0)
<!-- modified MADR 4.0.0 -->

# Timestamp filtering

* status: accepted <!-- proposed | rejected | accepted | deprecated | ... | superseded by ADR-0123 -->
* date: 2025-12-02 <!-- YYYY-MM-DD when the decision was last updated -->
* decision-makers: Hannah MacDonal, Todd Scharien <!-- list everyone involved in the decision -->
* consulted: <!-- list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication --> <!-- OPTIONAL -->
* informed: <!-- list everyone who is kept up-to-date on progress; and with whom there is a one-way communication} --> <!-- OPTIONAL -->

## Context and Problem Statement

Using [available metadata](0007-row-metadata.md), we want a mechanism to filter downstream responses using a timestamp provided from downstream's original request.

## Decision Drivers

* Reducing downstream response payload size
* Ability to view *"recently updated"* information only

## Considered Options

* `After` timestamp
* No other options were considered.

## Decision Outcome

Chosen option: "`After` timestamp", because it satisfies decision drivers.

### Consequences

* Good, because downstream clients will have the option to reduce response payload sizes based on how recently they have used an endpoint previously.

* Bad, because this kind of filtering does not play nice with pagination and "implied" states based on visibility.

    * This can be worked around—but does require extra work in every instance.

## More Information

Since we want information newer than the last time we use an endpoint, we chose the word "after" instead of "since" to more accurately describe its greater-than `>=` comparison to last-updated timestamp metadata.
