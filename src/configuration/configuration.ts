export default () => ({
  recordCache: {
    cacheTtlMs: parseInt(process.env.RECORD_CACHE_MS) || 5 * 60 * 1000, // 5 minutes
  },
  upstreamAuth: {
    case: {
      endpoint: process.env.CASE_ENDPOINT.trim().replace(/\s/g, '%20'),
      workspace: 'int_lab',
      idirField: 'Sales Rep',
    },
    incident: {
      endpoint: process.env.INCIDENT_ENDPOINT.trim().replace(/\s/g, '%20'),
      workspace: 'int_lab',
      idirField: 'Owned By',
    },
    sr: {
      endpoint: process.env.SR_ENDPOINT.trim().replace(/\s/g, '%20'),
      workspace: 'dev_sadmin_4426_2',
    },
    memo: {
      endpoint: process.env.MEMO_ENDPOINT.trim().replace(/\s/g, '%20'),
      workspace: undefined,
    },
  },
});
