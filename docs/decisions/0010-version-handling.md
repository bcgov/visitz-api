[//]: # (bc-madr v0.1.0)
<!-- modified MADR 4.0.0 -->

# Version Handling

* status: accepted <!-- proposed | rejected | accepted | deprecated | ... | superseded by ADR-0123 -->
* date: 2025-12-02 <!-- YYYY-MM-DD when the decision was last updated -->
* decision-makers: Hannah MacDonald, Todd Scharien <!-- list everyone involved in the decision -->
* consulted: Leo Lou (ARB) <!-- list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication --> <!-- OPTIONAL -->
* informed: <!-- list everyone who is kept up-to-date on progress; and with whom there is a one-way communication} --> <!-- OPTIONAL -->

## Context and Problem Statement

We want to keep upstream and downstream communication more stable by versioning non-backward-compatible releases of this API.

## Decision Drivers

* More relaxed upgrade cycle
* Potential to fall back to older versions for stability

## Considered Options

* Instances
* In-code versioning
* No versioning

## Decision Outcome

Chosen option: "No versioning", because it is not feasible for our upstream API to use instancing. Choosing to implement a versioning scheme anyway would not bring meaningful benefit.

### Consequences

* Good, because no effort required to maintain versioning tech
* Bad, because upgrades with non-backward-compatible changes MUST be heavily coordinated between downstream clients and the upstream API.

## Pros and Cons of the Options

### Instances

Using a reverse proxy with version number routing to different instances

e.g. `/v1/.../` -> version 1, and `/v2/.../` -> version 2

* Good, because multiple versions of the API can run at the same time
* Good, because multiple versions of the API are isolated from each other
* Good, because no development effort is required to support versioning
* Neutral, because extra DevOps effort required to manage versions
* Bad, because this can only be done if upstream APIs also use instancing

### In-code versioning

`ApiController1`, `ApiController2`, etc...

* Good, because small amounts of versioning is easy to implement
* Bad, because it scales exceptionally poorly and can quickly become a maintenance nightmare

### No versioning

* Good, because no extra mechanisms or processes to follow for versioning
* Bad, because releases MUST be heavily coordinated with up/downstreams

## More Information

Despite not using a versioning strategy for individual releases of this API, the project itself *is* versioned with `/v2` in a reverse proxy. The main difference being that this version string will stay the same for the duration of the project.
