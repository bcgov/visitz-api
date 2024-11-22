export default () => ({
  recordCache: {
    cacheTtlMs: parseInt(process.env.RECORD_CACHE_MS) || 5 * 60 * 1000, // 5 minutes
  },
  upstreamAuth: {
    case: {
      endpoint: (process.env.CASE_ENDPOINT ?? ' ').trim().replace(/\s/g, '%20'),
      workspace: 'int_lab',
      idirField: 'Sales Rep',
    },
    incident: {
      endpoint: (process.env.INCIDENT_ENDPOINT ?? ' ')
        .trim()
        .replace(/\s/g, '%20'),
      workspace: 'int_lab',
      idirField: 'Owned By',
    },
    sr: {
      endpoint: (process.env.SR_ENDPOINT ?? ' ').trim().replace(/\s/g, '%20'),
      workspace: 'int_lab',
      idirField: 'Owner',
    },
    memo: {
      endpoint: (process.env.MEMO_ENDPOINT ?? ' ').trim().replace(/\s/g, '%20'),
      workspace: undefined,
    },
  },
  oauth: {
    accessTokenUrl: process.env.ACCESS_TOKEN_URL ?? ' ',
    clientId: process.env.CLIENT_ID ?? ' ',
    clientSecret: process.env.CLIENT_SECRET ?? ' ',
  },
  workspaces: {
    supportNetwork: undefined,
    inPersonVisits: undefined,
    attachments: 'int_lab',
    postInPersonVisits: 'int_lab',
  },
  sinceFieldName: {
    supportNetwork: 'Updated',
    inPersonVisits: undefined,
    attachments: 'Last Updated Date',
  },
  skipAuthGuard: process.env.SKIP_AUTH_GUARD === 'true',
  endpointUrls: {
    baseUrl: process.env.UPSTREAM_BASE_URL ?? ' ',
    supportNetwork: process.env.SUPPORT_NETWORK_ENDPOINT ?? ' ',
    inPersonVisits: process.env.IN_PERSON_VISITS_ENDPOINT ?? ' ',
    postInPersonVisits: process.env.IN_PERSON_VISITS_POST_ENDPOINT ?? ' ',
    attachments: process.env.ATTACHMENTS_ENDPOINT ?? ' ',
  },
  buildInfo: {
    buildNumber: process.env.VPI_APP_LABEL ?? 'localBuild',
  },
});
