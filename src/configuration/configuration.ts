export default () => ({
  recordCache: {
    cacheTtlMs: parseInt(process.env.RECORD_CACHE_MS) || 5 * 60 * 1000, // 5 minutes
  },
  upstreamAuth: {
    case: {
      endpoint: encodeURIComponent((process.env.CASE_ENDPOINT ?? ' ').trim()),
      workspace: 'int_lab',
      idirField: 'Sales Rep',
    },
    incident: {
      endpoint: encodeURIComponent(
        (process.env.INCIDENT_ENDPOINT ?? ' ').trim(),
      ),
      workspace: 'int_lab',
      idirField: 'Owned By',
    },
    sr: {
      endpoint: encodeURIComponent((process.env.SR_ENDPOINT ?? ' ').trim()),
      workspace: 'int_lab',
      idirField: 'Owner',
    },
    memo: {
      endpoint: encodeURIComponent((process.env.MEMO_ENDPOINT ?? ' ').trim()),
      workspace: 'int_lab',
    },
  },
  oauth: {
    accessTokenUrl: process.env.ACCESS_TOKEN_URL ?? ' ',
    clientId: process.env.CLIENT_ID ?? ' ',
    clientSecret: process.env.CLIENT_SECRET ?? ' ',
  },
  workspaces: {
    supportNetwork: 'int_lab',
    inPersonVisits: 'int_lab',
    attachments: 'int_lab',
    postInPersonVisits: 'int_lab',
    contacts: 'int_lab',
  },
  sinceFieldName: {
    supportNetwork: 'Updated',
    inPersonVisits: 'Updated',
    attachments: 'Last Updated Date',
    contacts: 'Updated',
  },
  skipAuthGuard: process.env.SKIP_AUTH_GUARD === 'true',
  endpointUrls: {
    baseUrl: process.env.UPSTREAM_BASE_URL ?? ' ',
    supportNetwork: process.env.SUPPORT_NETWORK_ENDPOINT ?? ' ',
    inPersonVisits: process.env.IN_PERSON_VISITS_ENDPOINT ?? ' ',
    postInPersonVisits: process.env.IN_PERSON_VISITS_POST_ENDPOINT ?? ' ',
    attachments: process.env.ATTACHMENTS_ENDPOINT ?? ' ',
    caseContacts: process.env.CASE_CONTACTS_ENDPOINT ?? ' ',
    incidentContacts: process.env.INCIDENT_CONTACTS_ENDPOINT ?? ' ',
    srContacts: process.env.SR_CONTACTS_ENDPOINT ?? ' ',
    memoContacts: process.env.MEMO_CONTACTS_ENDPOINT ?? ' ',
  },
  buildInfo: {
    buildNumber: process.env.VPI_APP_LABEL ?? 'localBuild',
  },
});
