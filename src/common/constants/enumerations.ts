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

enum ContactLanguage {
  AmericanSignLanguage = 'American Sign Language',
  Amharic = 'Amharic',
  Arabic = 'Arabic',
  Armenian = 'Armenian',
  BabineWitsuwiten = "Babine-Witsuwit'en",
  Beaver = 'Beaver',
  Bengali = 'Bengali',
  Braille = 'Braille',
  Cajun = 'Cajun',
  Cantonese = 'Cantonese',
  Chilcotin = 'Chilcotin',
  ChinookJargon = 'Chinook Jargon',
  CoastTsimshian = 'Coast Tsimshian',
  ComoxSliamon = 'Comox/Sliamon',
  Cree = 'Cree',
  Croatian = 'Croatian',
  Czech = 'Czech',
  Danish = 'Danish',
  DitidatNitinat = 'Ditidat (Nitinat)',
  Dutch = 'Dutch',
  English = 'English',
  Farsi = 'Farsi',
  Finnish = 'Finnish',
  French = 'French',
  FrenchCreole = 'French Creole',
  German = 'German',
  Greek = 'Greek',
  Haida = 'Haida',
  Heiltsuk = 'Heiltsuk',
  Hindi = 'Hindi',
  Hungarian = 'Hungarian',
  Ilocano = 'Ilocano',
  Italian = 'Italian',
  Japanese = 'Japanese',
  Klallam = 'Klallam',
  KwakwalaKwakiutl = "Kwakw'ala (Kwakiutl)",
  Lillooet = 'Lillooet',
  Mandarin = 'Mandarin',
  Norwegian = 'Norwegian',
  Other = 'Other',
  Polish = 'Polish',
  Portuguese = 'Portuguese',
  Punjabi = 'Punjabi',
  Rumanian = 'Rumanian',
  Russian = 'Russian',
  Slave = 'Slave',
  SouthTsimshian = 'South Tsimshian',
  Spanish = 'Spanish',
  Squamish = 'Squamish',
  Swedish = 'Swedish',
  Tlingit = 'Tlingit',
  Turkish = 'Turkish',
  Ukrainian = 'Ukrainian',
  Yiddish = 'Yiddish',
}

enum ContactLanguageType {
  SignLanguage = 'Sign Language',
  WrittenSpoken = 'Written/Spoken',
  Written = 'Written',
  Spoken = 'Spoken',
  AssistiveTechnology = 'Assistive Technology',
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
  ContactLanguage,
  ContactLanguageType,
};
