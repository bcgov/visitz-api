```mermaid
---
title: Visitz API request flow with authorization control and file scanning
---
sequenceDiagram
  actor User as User agent
  participant Keycloak as OCIO-SSO
  participant Kong as OCIO-APS
  participant Vpi as Visitz API
  participant ClamAV as Anitivirus Scanner
  note over Vpi,ClamAV: Managed Container Services <br> Private Cloud Silver Tier <br> (MCS-Silver)
  participant Icm as ICM REST framework

  User->>Keycloak: Authenticate with PKCE
  Keycloak->>User: Return JWT tokens
  User->>Kong: Request with access token
  Kong->>Keycloak: Introspect access token
  Keycloak->>Kong: Introspection result

  Kong->>Vpi: Forward request

  alt is file upload request
  Vpi->>ClamAV : Send file for scanning
  ClamAV ->>Vpi: Return scan result
  alt is Bad file
    rect rgba(255, 0, 0, 0.3)
      Vpi->>Kong: Reject with HTTP:<br/>400 = infected<br/>422 = file unscannable
      Kong->>User: Forward response
    end
  end
end

  Vpi->>Icm: Authenticate with client credentials
  Icm->>Vpi: Return JWT tokens

  Vpi->>Icm: Check-authorization request with ID token<br/> & append username header
  Icm->>Vpi: Respond
  Vpi->>Vpi: Authorization logic and response filtering

  alt Unauthorized
    rect rgba(255, 0, 0, 0.3)
      Vpi->>Kong : Reject with HTTP 403
      Kong->>User: Forward response
    end
  else Authorized
    rect rgba(0, 255, 0, 0.3)
    Vpi->>Icm: Business request with ID token<br/> & append username header
    Icm->>Vpi: Forward response
      Vpi->>Kong : Respond
      Kong->>User: Respond
    end
  end
```

Additional information:

- [ICM REST framework](https://dev.azure.com/bc-icm/SiebelCRM%20Lab/_wiki/wikis/SiebelCRM-Lab.wiki/575/Siebel-Application-Client-ID-(Service-Account)-Operation-for-DATA-API)
