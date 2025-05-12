import { updatedDateFieldName } from '../common/constants/upstream-constants';

export default () => ({
  recordCache: {
    cacheTtlMs: parseInt(process.env.RECORD_CACHE_MS) || 5 * 60 * 1000, // 5 minutes
  },
  upstreamAuth: {
    case: {
      endpoint: encodeURI((process.env.CASE_ENDPOINT ?? ' ').trim()),
      workspace: process.env.CASE_WORKSPACE ?? undefined,
      idirField: process.env.CASE_IDIR_FIELD ?? undefined,
      searchspecIdirField: process.env.CASE_SEARCHSPEC_IDIR_FIELD ?? undefined,
      restrictedField: process.env.CASE_RESTRICTED_FIELD ?? undefined,
      typeField: process.env.CASE_TYPE_FIELD ?? undefined,
    },
    incident: {
      endpoint: encodeURI((process.env.INCIDENT_ENDPOINT ?? ' ').trim()),
      workspace: process.env.INCIDENT_WORKSPACE ?? undefined,
      idirField: process.env.INCIDENT_IDIR_FIELD ?? undefined,
      searchspecIdirField:
        process.env.INCIDENT_SEARCHSPEC_IDIR_FIELD ?? undefined,
      restrictedField: process.env.INCIDENT_RESTRICTED_FIELD ?? undefined,
    },
    sr: {
      endpoint: encodeURI((process.env.SR_ENDPOINT ?? ' ').trim()),
      workspace: process.env.SR_WORKSPACE ?? undefined,
      idirField: process.env.SR_IDIR_FIELD ?? undefined,
      searchspecIdirField: process.env.SR_SEARCHSPEC_IDIR_FIELD ?? undefined,
      restrictedField: process.env.SR_RESTRICTED_FIELD ?? undefined,
    },
    memo: {
      endpoint: encodeURI((process.env.MEMO_ENDPOINT ?? ' ').trim()),
      workspace: process.env.MEMO_WORKSPACE ?? undefined,
      idirField: process.env.MEMO_IDIR_FIELD ?? undefined,
      searchspecIdirField: process.env.MEMO_SEARCHSPEC_IDIR_FIELD ?? undefined,
      restrictedField: process.env.MEMO_RESTRICTED_FIELD ?? undefined,
    },
    employee: {
      endpoint: encodeURI((process.env.EMPLOYEE_ENDPOINT ?? ' ').trim()),
      workspace: process.env.EMPLOYEE_WORKSPACE ?? undefined,
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
    postAttachments: process.env.ATTACHMENTS_POST_WORKSPACE ?? undefined,
    postInPersonVisits:
      process.env.IN_PERSON_VISITS_POST_WORKSPACE ?? undefined,
    contacts: process.env.CONTACTS_WORKSPACE ?? undefined,
    safetyAssessments: process.env.SAFETY_ASSESSMENTS_WORKSPACE ?? undefined,
    responseNarratives: process.env.RESPONSE_NARRATIVES_WORKSPACE ?? undefined,
    caseNotes: process.env.CASE_NOTES_WORKSPACE ?? undefined,
  },
  afterFieldName: {
    supportNetwork: updatedDateFieldName,
    inPersonVisits: 'Updated',
    attachments: process.env.ATTACHMENTS_AFTER_FIELD ?? updatedDateFieldName,
    contacts: updatedDateFieldName,
    cases: process.env.CASE_AFTER_FIELD ?? undefined,
    incidents: process.env.INCIDENT_AFTER_FIELD ?? undefined,
    srs: process.env.SR_AFTER_FIELD ?? undefined,
    memos: process.env.MEMO_AFTER_FIELD ?? undefined,
    safetyAssessments: process.env.SAFETY_ASSESSMENTS_AFTER_FIELD ?? undefined,
    responseNarratives:
      process.env.RESPONSE_NARRATIVES_AFTER_FIELD ?? undefined,
    caseNotes: process.env.CASE_NOTES_AFTER_FIELD ?? undefined,
  },
  skipAuthGuard:
    process.env.VPI_APP_ENV === 'prod'
      ? false
      : process.env.SKIP_AUTH_GUARD === 'true',
  skipJWTCache:
    process.env.VPI_APP_ENV === 'prod'
      ? false
      : process.env.SKIP_JWT_CACHE === 'true',
  endpointUrls: {
    baseUrl: process.env.UPSTREAM_BASE_URL ?? ' ',
    supportNetwork: process.env.SUPPORT_NETWORK_ENDPOINT ?? ' ',
    inPersonVisits: process.env.IN_PERSON_VISITS_ENDPOINT ?? ' ',
    postInPersonVisits: process.env.IN_PERSON_VISITS_POST_ENDPOINT ?? ' ',
    attachments: process.env.ATTACHMENTS_ENDPOINT ?? ' ',
    postAttachments: process.env.ATTACHMENTS_POST_ENDPOINT ?? ' ',
    caseContacts: process.env.CASE_CONTACTS_ENDPOINT ?? ' ',
    incidentContacts: process.env.INCIDENT_CONTACTS_ENDPOINT ?? ' ',
    srContacts: process.env.SR_CONTACTS_ENDPOINT ?? ' ',
    memoContacts: process.env.MEMO_CONTACTS_ENDPOINT ?? ' ',
    safetyAssessments: process.env.SAFETY_ASSESSMENTS_ENDPOINT ?? ' ',
    incidentResponseNarratives:
      process.env.INCIDENT_RESPONSE_NARRATIVES_ENDPOINT ?? ' ',
    srResponseNarratives: process.env.SR_RESPONSE_NARRATIVES_ENDPOINT ?? ' ',
    caseNotes: process.env.CASE_NOTES_ENDPOINT ?? ' ',
  },
  fileUpload: {
    maxFileSizeBytes: parseInt(process.env.MAX_FILE_SIZE_BYTES) ?? 5242880,
  },
  clamav: {
    debugMode:
      process.env.CLAM_DEBUG_MODE != undefined
        ? process.env.CLAM_DEBUG_MODE === 'true'
        : false,
    clamdscan: {
      host: process.env.CLAMD_HOST,
      port: parseInt(process.env.CLAMD_PORT),
      timeout: process.env.CLAMD_TIMEOUT
        ? parseInt(process.env.CLAMD_TIMEOUT)
        : 120000,
      configFile:
        process.env.CLAMD_CONFIG_FILE && process.env.CLAMD_CONFIG_FILE != 'null'
          ? process.env.CLAMD_CONFIG_FILE
          : null,
      // Whether or not to use multiple cores when scanning
      multiscan:
        process.env.CLAMD_MULTI_SCAN != undefined
          ? process.env.CLAMD_MULTI_SCAN === 'true'
          : false,
      bypassTest:
        process.env.CLAMD_BYPASS_TEST != undefined
          ? process.env.CLAMD_BYPASS_TEST === 'true'
          : false,
    },
  },
  buildInfo: {
    buildNumber: process.env.VPI_APP_LABEL ?? 'localBuild',
  },
});
