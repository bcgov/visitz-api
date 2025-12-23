[//]: # (bc-madr v0.1.0)
<!-- modified MADR 4.0.0 -->

# Upstream Base Authorization

* status: accepted <!-- proposed | rejected | accepted | deprecated | ... | superseded by ADR-0123 -->
* date: 2025-12-02 <!-- YYYY-MM-DD when the decision was last updated -->
* decision-makers: Fred Wen (ARB), Hannah MacDonald, Leo Lou (ARB), Sagar Shah, Todd Scharien <!-- list everyone involved in the decision -->
* consulted: <!-- list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication --> <!-- OPTIONAL -->
* informed: <!-- list everyone who is kept up-to-date on progress; and with whom there is a one-way communication} --> <!-- OPTIONAL -->

## Context and Problem Statement

We need to be able to perform authorization checks on requesting clients to ensure they are allowed to interact with the API at all.

There may be additional authorization checks defined in other decisions for more specific scenarios—this decision covers authorizing access at a base level.

## Decision Drivers

* Authenticate users
* Authorization without manual requirements (as much as feasible)
* Easy and simple to maintain—or that we aren't required to maintain it

## Considered Options

* Common Keycloak service
* Siebel authorization

## Decision Outcome

Chosen options: "Common Keycloak service" for authentication and "Siebel authorization", because they cover each other's negatives to fully satisfy our decision drivers (and other negatives can be worked around).

### Consequences

* Good, because we get easy, low/no-maintenance authentication services from our Common Keycloak service.
* Good, because we can rely on Siebel and the access team to perform and maintain authorization with the system—instead of us manually handling a redundant layer of access.
* Bad, because requiring extra "meta-request" API calls could affect performance—but this can be mitigated with caching.

### Confirmation

Demo implementation to ARB members for approval.

## Pros and Cons of the Options

### Common Keycloak service

* Good, because authentication services are easy to set up and require almost zero maintenance.
* Good, because maintenance of the overall instance is another team's responsibility.
* Good, because it has an authorization mechanism
* Bad, because the available instance is run as zero-trust. Automatically applying authorization rules is currently not possible in the system.
* Bad, because authorization is a manual process, requiring extra UI development work in clients for good UX.

### Siebel authorization

* Good, because Siebel has a built-in authorized-employee mechanism, which is already used for base access to the UI.
    * This would require the API to make an additional "meta-request" to find this information before every main request.
* Good, because Siebel has a built-in visibility mechanism, which is already used in the UI.
* Good, because it is already used for access to the UI.
* Good, because access is managed by another team.
* Bad, because Siebel does not provide authentication services—only authorization.
* Bad, because it adds extra upstream requests as part of authorization checks.
    * However, results can be cached to improve performance.
