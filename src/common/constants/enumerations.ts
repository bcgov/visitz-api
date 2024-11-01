enum RecordType {
  Case = 'case',
  Incident = 'incident',
  SR = 'sr',
  Memo = 'memo',
}

enum EntityType {
  Case = 'Case',
  Incident = 'Incident',
  SR = 'Service Request',
}

const RecordEntityMap = {
  [RecordType.Case]: EntityType.Case,
  [RecordType.Incident]: EntityType.Incident,
  [RecordType.SR]: EntityType.SR,
} as const;

export { RecordType, EntityType, RecordEntityMap };
