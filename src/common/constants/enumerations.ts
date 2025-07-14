import {
  casesAttachmentsFieldName,
  incidentsAttachmentsFieldName,
  memoAttachmentsFieldName,
  srAttachmentsFieldName,
} from './parameter-constants';

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

enum RecordCountNeededEnum {
  True = 'true',
  False = 'false',
}

enum RestrictedRecordEnum {
  True = 'Y',
  False = 'N',
}

enum ExcludeEmptyFieldsEnum {
  True = 'Y',
  False = 'N',
}

const AttachmentParentIdFieldMap = {
  [RecordType.Case]: casesAttachmentsFieldName,
  [RecordType.Incident]: incidentsAttachmentsFieldName,
  [RecordType.SR]: srAttachmentsFieldName,
  [RecordType.Memo]: memoAttachmentsFieldName,
} as const;

enum AttachmentStatusEnum {
  Profiled = 'Profiled',
  UnProfiled = 'Un-Profiled',
  Recycled = 'Recycled',
  Void = 'Void',
  Archived = 'Archived',
  Open = 'Open',
  InProgress = 'In Progress',
  Complete = 'Complete',
  Cancelled = 'Cancelled',
  // There is an additional value of 'System Only', but we shouldn't allow
  // the user to set this.
}

enum CaseType {
  ChildServices = 'Child Services',
  FamilyServices = 'Family Services',
  // There are additional types, but these are the only ones we want to show
}

enum IncidentType {
  ChildProtection = 'Child Protection',
  // There are additional types, but these are the only ones we want to show
}

enum EntityStatus {
  Open = 'Open',
  // We only want to show open cases
}

export {
  RecordType,
  EntityType,
  RecordEntityMap,
  VisitDetails,
  RecordCountNeededEnum,
  RestrictedRecordEnum,
  ExcludeEmptyFieldsEnum,
  AttachmentParentIdFieldMap,
  AttachmentStatusEnum,
  CaseType,
  IncidentType,
  EntityStatus,
};
