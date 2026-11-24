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

const EntityRecordMap = {
  [EntityType.Case]: RecordType.Case,
  [EntityType.Incident]: RecordType.Incident,
  [EntityType.SR]: RecordType.SR,
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

enum BooleanStringEnum {
  True = 'true',
  False = 'false',
}

enum YNEnum {
  True = 'Y',
  False = 'N',
}

enum YesNoEnum {
  True = 'Yes',
  False = 'No',
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
  CYSNFamilyServices = 'CYSN Family Services',
  Resource = 'Resource',
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

enum SafetyAssessmentDecisionUnsafe {
  All = 'All children placed',
  Some = 'Some children placed',
}

enum ActivityActionBy {
  Client = 'Client',
  External = 'External',
  Health = 'Health',
  Staff = 'Staff',
  Supervisor = 'Supervisor',
  System = 'System',
}

enum ActivityPriority {
  Urgent = '1-Urgent',
  High = '2-High',
  Standard = '3-Standard',
}

enum ActivityStatus {
  Cancelled = 'Cancelled',
  Closed = 'Closed',
  IsError = 'Error',
  InProgress = 'In Progress',
  Open = 'Open',
  Pending = 'Pending',
  Scheduled = 'Scheduled',
  SetUp = 'Set Up',
}

enum ContactEducationDegree {
  One = '1',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Eleven = '11',
  Twelve = '12',
  Daycare = 'Daycare',
  ElementarySchool = 'Elementary school',
  Grade12GEDEquiv = 'Grade 12 grad/GED/equivalent',
  GraduatedAdult = 'Graduated Adult',
  HomeSchooledStudent = 'Home Schooled Student',
  FullDayKindergarten = 'KF - full day kindergarten',
  HalfDayKindergarten = 'KH - half day kindergarten',
  LessThanGrade10 = 'Less than grade 10',
  PostSecondaryCertFirstYearAppren = 'Post-sec certif/1st yr appren',
  PostSecondaryDiplomaSecondYearAppren = 'Post-sec diploma/2st yr appren',
  PostSecondaryDegree = 'Post-secondary degree',
  PreKindergarten = 'Pre-Kindergarten',
  SecondarySchool = 'Secondary school',
  SomeHighSchool = 'Some high school(grades 10-12)',
  SomePostSecondaryTrades = 'Some post-sec/entry trds train',
  TradesThirdFourthYear = 'Trades (3rd/4th yr appren)',
  TradesCert = 'Trades cert (Journey Person)',
  Unspecified = 'Unspecified',
}

enum ActivityPlanStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  Pending = 'Pending',
  Cancelled = 'Cancelled',
  Closed = 'Closed',
}
enum EntityScope {
  Assigned = 'Assigned',
  Office = 'Office',
}

enum AppLogLevel {
  Fatal = 60,
  Error = 50,
  Warn = 40,
  Log = 30,
  Debug = 20,
  Verbose = 10,
}

export {
  RecordType,
  EntityType,
  RecordEntityMap,
  EntityRecordMap,
  VisitDetails,
  BooleanStringEnum,
  YNEnum,
  YesNoEnum,
  AttachmentParentIdFieldMap,
  AttachmentStatusEnum,
  CaseType,
  IncidentType,
  EntityStatus,
  SafetyAssessmentDecisionUnsafe,
  ActivityActionBy,
  ActivityPriority,
  ActivityStatus,
  ContactEducationDegree,
  ActivityPlanStatus,
  EntityScope,
  AppLogLevel,
};
