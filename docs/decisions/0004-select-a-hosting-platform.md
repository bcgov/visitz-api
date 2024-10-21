[//]: # (bc-madr v0.1)
<!-- modified MADR 4.0.0 -->

# Select a cloud hosting platform

* status: proposed <!-- proposed | rejected | accepted | deprecated | ... | superseded by ADR-0123 -->
* date: 2024-09-23 <!-- YYYY-MM-DD when the decision was last updated -->
* decision-makers: Leo Lou (ARB), Keith Parkin (ARB), Sagar Shah, Todd Scharien, Fred Wen (ARB) <!-- list everyone involved in the decision -->
* consulted: Leo Lou (ARB), Fred Wen (ARB) <!-- list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication --> <!-- OPTIONAL -->

## Context and Problem Statement

We need a place to host and run the MCFD Mobility middleware API.

## Considered Options

* OpenShift
* No other options were considered

## Decision Outcome

Chosen option: "OpenShift", because no other options were considered.

### Consequences

* Good, because OpenShift is provided as a free private cloud service to BC Gov at large
* Good, because there is a growing internal community to draw support from
* Good, because of Kubernetes' reliability
* Good, because we can use Helm for Infrastructure as Code
* Good, because we can set up CI/CD for rapid development and easier deployments
* Bad, because OpenShift can be difficult to learn, making developer onboarding require more effort

### Confirmation

Work with members of ARB to review Helm charts and confirm the architecture is set up correctly.
