[//]: # (bc-madr v0.1)
<!-- modified MADR 4.0.0 -->

# Choose an Antivirus Solution

* status: proposed <!-- proposed | rejected | accepted | deprecated | ... | superseded by ADR-0123 -->
* date: 2025-04-29 <!-- YYYY-MM-DD when the decision was last updated -->
* decision-makers: Todd Scharien, Hannah MacDonald, Sagar Shah <!-- list everyone involved in the decision -->
* consulted: Leo Lou <!-- list everyone whose opinions are sought (typically subject-matter experts); and with whom there is a two-way communication --> <!-- OPTIONAL -->
* informed: <!-- list everyone who is kept up-to-date on progress; and with whom there is a one-way communication} --> <!-- OPTIONAL -->

## Context and Problem Statement

When receiving file uploads through our API, we want to ensure that they are free of malware. As such, we need an antivirus file scanning solution.

For context, most of the ClamAV alternatives were looked in to because it was stated that Microsoft might have the Antivirus scanning capability we were looking for. These largely did not meet our most basic requirement, which is the ability to scan individual files for viruses.

## Decision Drivers

* Maintainable
* Can scan individual files on demand

## Considered Options

* ClamAV
* Microsoft Defender for Endpoint
* Microsoft Defender for APIs
* Microsoft Defender External Attack Surface Management (EASM)
* No API-level scanning
* mTLS / Client certificate pinning

## Decision Outcome

Chosen option: "ClamAV", because it best satisfies the decision drivers—despite potential deployment issues into OpenShift.

### Consequences

* Good, because we can easily scan individual files through code.
* Bad, because ClamAV is not easily scalable.

## Pros and Cons of the Options

### ClamAV

 https://www.clamav.net/ | [BcGov GitHub Self Set Up](https://github.com/bcgov/clamav)  |  [BcGov GitHub Virus Definitions Mirror](https://github.com/bcgov/common-hosted-clamav-service)

> ClamAV® is an open-source antivirus engine for detecting trojans, viruses, malware & other malicious threats.

* Good, because it allows for individual virus scanning of files.
* Good, because it is commonly used within BCGov.
* Neutral, because a BCGov common hosted service for ClamAV has been discussed several times but never implemented.
* Neutral, because we can host it ourselves on OpenShift.
* Bad, because it is known to be difficult to set up and maintain on OpenShift.
* Bad, because the BCGov mirror for virus definitions is currently broken. Self deployed versions can face permission issues on OpenShift, and without it, we can't get it working on Emerald at all since it can't pull in the update images from ClamAV due to the proxy.

### Microsoft Defender for Endpoint

https://www.microsoft.com/en-ca/security/business/endpoint-security/microsoft-defender-endpoint

> Help secure endpoints with industry-leading, multiplatform detection and response.

* Good, because we can scan for viruses directly on users' machines before reaching an API endpoint.
* Good, because we can enforce via group policy that users run Defender on their devices.
* Good, because Defender is supported on the mobile app's supported OS's.
* Bad, because this is for "endpoint" protection as in end user devices, not APIs.
* Bad, because this appears not to have file virus scanning abilities via API URL, just system ones for end user devices.

### Microsoft Defender for APIs

https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-apis-introduction

> Microsoft Defender for APIs is a plan provided by Microsoft Defender for Cloud that offers full lifecycle protection, detection, and response coverage for APIs.

* Bad, because this only applicable to APIs published in Azure API Management. In other words, our APIs would need to using Azure as a gateway to enable this service.
* Bad, because this seems to be more aimed towards DDoS protection and blocking suspicious IPs, not actual virus scanning.

### Microsoft Defender External Attack Surface Management (EASM)

https://learn.microsoft.com/en-ca/azure/external-attack-surface-management/

> Microsoft Defender External Attack Surface Management (Defender EASM) continuously discovers and maps your digital attack surface to provide an external view of your online infrastructure. This visibility enables security and IT teams to identify unknowns, prioritize risk, eliminate threats, and extend vulnerability and exposure control beyond the firewall.

* Bad, because this is an attack surface monitoring service, not an antivirus file scanner.

### No API-level scanning

* Good, because we don't have to maintain any scanning mechanism—in code or otherwise.
* Bad, because file scanning would need to take place at the device level—which may not always be enforceable.
* Bad, because endpoints could be vulnerable if not accessed by expected devices.

### mTLS / Client certificate pinning

* Good, because we would have more assurance that communications are not being spoofed or intercepted.
* Bad, because we could only implement this in apps we have control of.
* Bad, because we would need to maintain and refresh additional certificates through the app's and API's lifecycle.
