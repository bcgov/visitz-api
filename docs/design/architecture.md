```mermaid
---
title: Visitz API architecture
---
flowchart TD
    User[User agent] --> |Authenticate with PKCE| Keycloak[OCIO-SSO]
    User --> |Request with access token| Kong[OCIO-APS]
    Kong <--> |Introspect access token| Keycloak
    Kong --> |Forward request| Vpi[Visitz API<br/>OpenShift Silver]
    Vpi <--> ClamAV
    Vpi <--> |Authenticate with client credentials| Icm[ICM REST framework]
    Vpi --> |Request with ID token, append username header| Icm
```

Additional information:

- [ICM REST framework](https://dev.azure.com/bc-icm/SiebelCRM%20Lab/_wiki/wikis/SiebelCRM-Lab.wiki/575/Siebel-Application-Client-ID-(Service-Account)-Operation-for-DATA-API)
