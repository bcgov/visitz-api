import { updatedDateFieldName } from '../common/constants/upstream-constants';

export default () => ({
  recordCache: {
    cacheTtlMs: parseInt(process.env.RECORD_CACHE_MS) || 5 * 60 * 1000, // 5 minutes
  },
  upstreamAuth: {
    case: {
      endpoint: encodeURI((process.env.CASE_ENDPOINT ?? ' ').trim()),
      workspace: process.env.CASE_WORKSPACE ?? undefined,
      idirField: 'Sales Rep',
    },
    incident: {
      endpoint: encodeURI((process.env.INCIDENT_ENDPOINT ?? ' ').trim()),
      workspace: process.env.INCIDENT_WORKSPACE ?? undefined,
      idirField: 'Owned By',
      // TODO: change to Assigned To when this is ready
    },
    sr: {
      endpoint: encodeURI((process.env.SR_ENDPOINT ?? ' ').trim()),
      workspace: process.env.SR_WORKSPACE ?? undefined,
      idirField: 'Assigned To',
    },
    memo: {
      endpoint: encodeURI((process.env.MEMO_ENDPOINT ?? ' ').trim()),
      workspace: process.env.MEMO_WORKSPACE ?? undefined,
      idirField: 'Assigned To',
    },
  },
  oauth: {
    accessTokenUrl: process.env.ACCESS_TOKEN_URL ?? ' ',
    clientId: process.env.CLIENT_ID ?? ' ',
    clientSecret: process.env.CLIENT_SECRET ?? ' ',
  },
  workspaces: {
    supportNetwork: process.env.SUPPORT_NETWORK_WORKSPACE ?? undefined,
    inPersonVisits: process.env.IN_PERSON_VISITS_WORKSPACE ?? undefined,
    attachments: process.env.ATTACHMENTS_WORKSPACE ?? undefined,
    postInPersonVisits:
      process.env.IN_PERSON_VISITS_POST_WORKSPACE ?? undefined,
    contacts: process.env.CONTACTS_WORKSPACE ?? undefined,
  },
  sinceFieldName: {
    supportNetwork: updatedDateFieldName,
    inPersonVisits: updatedDateFieldName,
    attachments: updatedDateFieldName,
    contacts: updatedDateFieldName,
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
