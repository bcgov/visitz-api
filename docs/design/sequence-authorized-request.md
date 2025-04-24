```mermaid
---
title: Authorized sequence
---
sequenceDiagram
    actor User as User agent
    participant Keycloak
    participant VKong as Kong
    participant Vpi as Visitz API<br/>(OpenShift)
    participant Icm as ICM REST framework

    User->>Keycloak: Authenticate with PKCE
    Keycloak->>User: Return JWT tokens
    User->>VKong: Request with access token
    VKong->>Keycloak: Introspect access token
    Keycloak->>VKong: Introspection result
    VKong->>Vpi: Forward request
    Vpi->>Icm: Authenticate with client credentials
    Icm->>Vpi: Return JWT tokens
    Vpi->>Icm: New request with ID token & append username header
    Icm->>Vpi: Forward response
    Vpi->>Vpi: Apply authorization logic and response filtering
    Vpi->>VKong: Respond
    VKong->>User: Forward response
```

Additional information:

- [ICM REST framework](https://dev.azure.com/bc-icm/SiebelCRM%20Lab/_wiki/wikis/SiebelCRM-Lab.wiki/575/Siebel-Application-Client-ID-(Service-Account)-Operation-for-DATA-API)
