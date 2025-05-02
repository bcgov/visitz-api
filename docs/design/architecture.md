```mermaid
---
title: Visitz API architecture
---
flowchart TD
  User[User agent]
  IdBroker[OCIO-SSO]
  RevProxy[OCIO-APS]
  Vpi[Visitz API]
  Av[Antivirus scanner]
  Icm[ICM REST framework]

  User --> |Authenticate with PKCE| IdBroker
  User --> |Request with access token| RevProxy

  RevProxy <--> |Introspect access token| IdBroker
  RevProxy --> |Forward request| Container

  subgraph Container["Managed Container Services"]
    direction TB
    Vpi <--> Av
  end

  Vpi <--> |Authenticate with client credentials| Icm
  Vpi ----> |Request with ID token, append username header| Icm
```

Additional information:

- Managed Container Services: Private Cloud Silver Tier (MCS-Silver)
- [ICM REST framework](https://dev.azure.com/bc-icm/SiebelCRM%20Lab/_wiki/wikis/SiebelCRM-Lab.wiki/575/Siebel-Application-Client-ID-(Service-Account)-Operation-for-DATA-API)
