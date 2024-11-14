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

enum VisitDetails {
  PrivateVisitZeroToFive = 'Private visit age 0-5',
  PrivateVisitInHome = 'Private visit in home',
  PrivateVisitMedSupportNeeds = 'Private visit medical or support needs',
  PrivateVisitNotInHome = 'Private visit not in home',
  ExemptionVisitChildDeclined = 'Exemption to private visit - Child declined to meet',
  ExemptionVisitOther = 'Exemption to private visit - Other',
  NotPrivatePlanMeeting = 'Not private - Planning meeting',
  NotPrivateRelation = 'Not private - Relational visit',
  NotPrivateInHome = 'Not private - Visit in the home',
  NotPrivateCaregiver = 'Not private - Visit with caregiver',
}

export { RecordType, EntityType, RecordEntityMap, VisitDetails };
