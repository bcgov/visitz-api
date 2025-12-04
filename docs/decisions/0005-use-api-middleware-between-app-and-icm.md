[//]: # (bc-madr v0.1)
<!-- modified MADR 4.0.0 -->

# Use API middleware between app and ICM

* status: accepted <!-- proposed | rejected | accepted | deprecated | ... | superseded by ADR-0123 -->
* date: 2025-12-02 <!-- YYYY-MM-DD when the decision was last updated -->
* decision-makers: Leo Lou (ARB), Keith Parkin (ARB), Sagar Shah, Todd Scharien, Fred Wen (ARB) <!-- list everyone involved in the decision -->
* consulted: Leo Lou (ARB), Fred Wen (ARB) <!-- list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication --> <!-- OPTIONAL -->

## Context and Problem Statement

1. The app currently does not use any middleware API component that the project team has direct control over.
2. The team supporting the middleware API we currently use follows Waterfall instead of our Scrum, so our timelines often aren't aligned.
3. The current middleware API is a low-code system, so complex requirements become an even larger endeavor than they would otherwise.

## Decision Drivers

* Ability to rapidly iterate on our API implementation
* Use ICM's REST API directly in a secure way
* Enable more complex flows (e.g. Anti-Virus scanning)

## Considered Options

* Write custom middleware
* Use integration software

## Decision Outcome

Chosen option: "Write custom middleware", because it best satisfies the decision drivers.

### Consequences

* Good, because we'll be able to more rapidly iterate our middleware API alongside the app, rather than waiting on a Waterfall timeline.
* Bad, because more developer effort is required within our project team, rather than relying on other teams

### Confirmation

Work with members of ARB to review designs, plans, and the actual solution after implementation to confirm the architecture is set up correctly.

## Pros and Cons of the Options

### Write custom middleware

* Good, because we have full development control of our solution
* Good, because if we use a popular API framework, developer onboarding is less effort
* Good, because any change requires a developer and for the changes to go through the typical review process
* Bad, because developer effort spent on middleware is taken away from work on the app
  * Unless more developers are onboarded with a focus on middleware work

### Use integration software

* Good, because less development effort is required up front
* Good, because more development effort could be spent on the app itself
* Bad, because the selected software may not support version control
  * If it doesn't support version control, that means we can't use our typical Pull Request review process
* Bad, because more complex tasks depend on availability of components
* Bad, because we would need to create complex components if they don't exist (which requires developers anyway)
