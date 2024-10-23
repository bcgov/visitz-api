enum RecordType {
  Case = 'case',
  Incident = 'incident',
  SR = 'sr',
  Memo = 'memo',
}

const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export { RecordType, DEFAULT_CACHE_TTL_MS };
